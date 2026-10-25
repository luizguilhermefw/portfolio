import 'reflect-metadata';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from '../dist/auth/auth.service.js';
import { AuthGuard } from '../dist/auth/auth.guard.js';
import { AuthController } from '../dist/auth/auth.controller.js';
import { createSessionToken, hashSessionToken } from '../dist/auth/session-token.js';
import { hashPassword, verifyPassword } from '../dist/auth/password.js';
import { sessionCookieOptions } from '../dist/auth/session.config.js';
import { PostsService } from '../dist/posts/posts.service.js';
import { CreatePostDto, UpdatePostDto } from '../dist/posts/post.dto.js';
import { ListPostsQueryDto } from '../dist/posts/list-posts-query.dto.js';
import { ApiExceptionFilter } from '../dist/common/api-exception.filter.js';
import { Prisma } from '../dist/generated/prisma/client.js';

const status = (code) => (error) => error.getStatus?.() === code;
const admin = { id: 'admin-test', username: 'luiz' };
const input = { title: 'Artigo', slug: 'artigo', contentHtml: '<p>Conteúdo</p>' };
const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

test('tokens têm 256 bits, são distintos e só o hash deve ser persistido', () => {
  const a = createSessionToken(), b = createSessionToken();
  assert.match(a, /^[a-f0-9]{64}$/);
  assert.notEqual(a, b);
  assert.notEqual(hashSessionToken(a), a);
  assert.equal(hashSessionToken(a), hashSessionToken(a));
});

test('Argon2id verifica senha válida e rejeita senha inválida', async () => {
  const hash = await hashPassword('senha-apenas-do-teste');
  assert.ok(hash.startsWith('$argon2id$'));
  assert.equal(await verifyPassword(hash, 'senha-apenas-do-teste'), true);
  assert.equal(await verifyPassword(hash, 'incorreta'), false);
});

test('login inválido tem erro genérico e não cria sessão', async () => {
  const passwordHash = await hashPassword('senha-apenas-do-teste');
  for (const record of [null, { ...admin, passwordHash }]) {
    const service = new AuthService({ admin: { findUnique: async () => record } });
    await assert.rejects(service.login({ username: 'luiz', password: 'incorreta' }),
      (e) => status(401)(e) && e.message === 'Credenciais inválidas');
  }
});

test('login persiste apenas hash, expira em sete dias e rotaciona sessão anterior', async () => {
  const passwordHash = await hashPassword('senha-apenas-do-teste');
  let saved, removed;
  const service = new AuthService({
    admin: { findUnique: async () => ({ ...admin, passwordHash }) },
    $transaction: async (fn) => fn({ adminSession: {
      create: async (args) => { saved = args.data; },
      deleteMany: async (args) => { removed = args.where; },
    } }),
  });
  const oldToken = createSessionToken();
  const before = Date.now();
  const result = await service.login({ username: 'luiz', password: 'senha-apenas-do-teste' }, oldToken);
  assert.deepEqual(result.admin, admin);
  assert.equal(saved.tokenHash, hashSessionToken(result.token));
  assert.equal(saved.token, undefined);
  assert.equal(removed.tokenHash, hashSessionToken(oldToken));
  assert.ok(saved.expiresAt.getTime() >= before + 7 * 86400000);
  assert.ok(saved.expiresAt.getTime() <= Date.now() + 7 * 86400000);
});

test('guard sem cookie rejeita antes de consultar Prisma', async () => {
  const guard = new AuthGuard(new AuthService({}));
  await assert.rejects(guard.canActivate({
    switchToHttp: () => ({ getRequest: () => ({ cookies: {} }) }),
  }), status(401));
});

test('sessão expirada/revogada não autentica; consulta exige expiresAt futuro', async () => {
  let where;
  const service = new AuthService({ adminSession: { findFirst: async (args) => {
    where = args.where; return null;
  } } });
  await assert.rejects(service.authenticate(createSessionToken()), status(401));
  assert.ok(where.expiresAt.gt instanceof Date);
});

test('guard válido anexa somente identidade e me não revela sessão', async () => {
  const service = new AuthService({ adminSession: { findFirst: async () => ({ id: 'session', admin }) } });
  const request = { cookies: { blog_session: createSessionToken() } };
  await new AuthGuard(service).canActivate({ switchToHttp: () => ({ getRequest: () => request }) });
  assert.deepEqual(new AuthController(service).me(request), admin);
});

test('controller envia token somente no cookie e limpa cookie no logout', async () => {
  const token = createSessionToken(), expiresAt = new Date(Date.now() + 1000);
  let cookie, cleared, revoked;
  const controller = new AuthController({
    login: async () => ({ token, expiresAt, admin }),
    logout: async (id) => { revoked = id; },
  });
  const result = await controller.login({}, { cookies: {} }, { cookie: (...args) => { cookie = args; } });
  assert.deepEqual(result, admin);
  assert.equal(cookie[1], token);
  assert.equal(cookie[2].httpOnly, true);
  assert.equal(cookie[2].sameSite, 'lax');
  assert.equal(cookie[2].path, '/api/blog/v1');
  assert.equal(cookie[2].expires, expiresAt);
  await controller.logout({ auth: { sessionId: 'session' } }, { clearCookie: (...args) => { cleared = args; } });
  assert.equal(revoked, 'session');
  assert.equal(cleared[0], 'blog_session');
  assert.deepEqual(cleared[1], sessionCookieOptions());
});

test('cookie usa Secure em produção', () => {
  const previous = process.env.NODE_ENV;
  try { process.env.NODE_ENV = 'production'; assert.equal(sessionCookieOptions().secure, true); }
  finally { if (previous === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous; }
});

test('logout deleteMany é seguro quando sessão já foi removida', async () => {
  const service = new AuthService({ adminSession: { deleteMany: async () => ({ count: 0 }) } });
  await service.logout('session');
  await service.logout('session');
});

test('DTOs rejeitam campos arbitrários, null obrigatório e slug inválido', async () => {
  for (const body of [{ ...input, status: 'PUBLISHED' }, { ...input, title: null }, { ...input, slug: 'Meu Slug' }]) {
    await assert.rejects(pipe.transform(body, { type: 'body', metatype: CreatePostDto }), status(400));
  }
  for (const body of [{ publishedAt: new Date() }, { title: null }, { contentHtml: '  ' }]) {
    await assert.rejects(pipe.transform(body, { type: 'body', metatype: UpdatePostDto }), status(400));
  }
  const partial = await pipe.transform({ excerpt: null }, { type: 'body', metatype: UpdatePostDto });
  assert.equal(partial.excerpt, null);
});

test('paginação valida limites, rejeita arrays/status e aplica defaults', async () => {
  const q = await pipe.transform({}, { type: 'query', metatype: ListPostsQueryDto });
  assert.equal(q.page, 1); assert.equal(q.limit, 10);
  for (const query of [{ limit: '101' }, { page: '0' }, { page: ['1'] }, { status: 'DRAFT' }]) {
    await assert.rejects(pipe.transform(query, { type: 'query', metatype: ListPostsQueryDto }), status(400));
  }
});

test('criação é DRAFT e categoria inválida retorna 400', async () => {
  const service = new PostsService({
    post: { create: async ({ data }) => data },
    category: { findUnique: async () => null },
  });
  assert.equal((await service.create(input)).status, 'DRAFT');
  await assert.rejects(service.create({ ...input, categoryId: 'missing' }), status(400));
});

test('publish idempotente, unpublish preserva data e republicação não a troca', async () => {
  let record = { ...input, id: 'post', status: 'DRAFT', publishedAt: null };
  const post = {
    findUnique: async () => ({ ...record }),
    updateMany: async ({ where, data }) => {
      if (record.publishedAt === where.publishedAt) record = { ...record, ...data };
    },
    update: async ({ data }) => (record = { ...record, ...data }),
  };
  const service = new PostsService({ post, $transaction: async (fn) => fn({ post }) });
  await service.publish('post');
  const date = record.publishedAt;
  assert.equal(record.status, 'PUBLISHED'); assert.ok(date instanceof Date);
  await service.publish('post'); assert.equal(record.publishedAt, date);
  await service.unpublish('post'); assert.equal(record.status, 'DRAFT'); assert.equal(record.publishedAt, date);
  await service.publish('post'); assert.equal(record.publishedAt, date);
});

test('publish recusa conteúdo mínimo ausente', async () => {
  const service = new PostsService({ $transaction: async (fn) => fn({
    post: { findUnique: async () => ({ title: '', slug: 'post', contentHtml: '' }) },
  }) });
  await assert.rejects(service.publish('post'), status(400));
});

test('listagem pública força PUBLISHED, pagina e não seleciona HTML', async () => {
  let selection;
  const service = new PostsService({
    post: {
      findMany: async (args) => { selection = args; return []; },
      count: async ({ where }) => { assert.equal(where.status, 'PUBLISHED'); return 21; },
    },
    $transaction: async (ops) => Promise.all(ops),
  });
  const result = await service.findPublished({ page: 2, limit: 10, category: 'backend', search: 'Nest' });
  assert.equal(selection.where.status, 'PUBLISHED');
  assert.equal(selection.where.category.slug, 'backend');
  assert.equal(selection.select.contentHtml, undefined);
  assert.equal(selection.skip, 10); assert.equal(selection.take, 10);
  assert.equal(result.totalPages, 3);
});

test('slug ausente ou draft retorna 404; detalhe exige PUBLISHED', async () => {
  const service = new PostsService({ post: { findFirst: async ({ where, select }) => {
    assert.equal(where.status, 'PUBLISHED');
    assert.equal(select.contentHtml, true);
    return null;
  } } });
  await assert.rejects(service.findPublicBySlug('inexistente'), status(404));
  await assert.rejects(service.findPublicBySlug('rascunho'), status(404));
});

test('erros Prisma são traduzidos sem SQL/stack/hashes', () => {
  const filter = new ApiExceptionFilter();
  for (const [code, expected] of [['P2002', 409], ['P2025', 404], ['P2003', 400], ['P9999', 500]]) {
    let responseCode, body;
    const response = { status: (value) => { responseCode = value; return response; }, json: (value) => { body = value; } };
    filter.catch(new Prisma.PrismaClientKnownRequestError('internal-secret-SQL', { code, clientVersion: 'test' }),
      { switchToHttp: () => ({ getResponse: () => response }) });
    assert.equal(responseCode, expected);
    assert.ok(!JSON.stringify(body).includes('internal-secret-SQL'));
    assert.equal(body.stack, undefined);
  }
});
