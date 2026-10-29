import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Use the existing TypeScript compiler and Node runner; no test dependency.
async function moduleUrl(path, imports = {}) {
  let source = await readFile(new URL(path, import.meta.url), 'utf8');
  for (const [from, to] of Object.entries(imports)) source = source.replaceAll(`'${from}'`, `'${to}'`);
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return 'data:text/javascript;base64,' + Buffer.from(outputText).toString('base64');
}
const { slugify } = await import(await moduleUrl('../src/utils/slugify.ts'));
const errorUrl = await moduleUrl('../src/utils/admin-errors.ts');
const { AdminApiError, adminErrorMessage } = await import(errorUrl);
const { postPayload } = await import(await moduleUrl('../src/utils/post-form.ts'));
const api = await import(await moduleUrl('../src/api/admin.ts', { '../utils/admin-errors': errorUrl }));

test('pattern HTML do username aceita nomes válidos no modo UnicodeSets', async () => {
  const source = await readFile(new URL('../src/pages/admin/LoginPage.vue', import.meta.url), 'utf8');
  const pattern = source.match(/id="username"[^>]*pattern="([^"]+)"/)[1];
  const regex = new RegExp(`^(?:${pattern})$`, 'v');
  for (const username of ['luiz', 'Luiz123', 'luiz.g', 'luiz_g', 'luiz-g']) assert.ok(regex.test(username));
  for (const username of ['', 'luiz g', 'luiz@g']) assert.equal(regex.test(username), false);
});

test('slug normaliza acentos, caracteres inválidos e hífens', () => {
  assert.equal(slugify('  Integrações & Automação -- V2!  '), 'integracoes-automacao-v2');
  assert.equal(slugify('---'), '');
  assert.equal(slugify('a'.repeat(210)).length, 200);
});

test('erros apresentam mensagens seguras para login, 401, 404, 409 e 400', () => {
  assert.equal(adminErrorMessage(new AdminApiError(401), true), 'Usuário ou senha inválidos.');
  assert.match(adminErrorMessage(new AdminApiError(401)), /sessão expirou/);
  assert.equal(adminErrorMessage(new AdminApiError(404)), 'Post não encontrado');
  assert.equal(adminErrorMessage(new AdminApiError(409)), 'Já existe um post com este slug.');
  assert.match(adminErrorMessage(new AdminApiError(400)), /Confira os campos/);
  assert.equal(adminErrorMessage(new Error('private server diagnostic')), adminErrorMessage(new AdminApiError(500)));
});

test('payload contém somente campos editáveis e permite limpar opcionais', () => {
  const result = postPayload({ title: ' Título ', slug: ' titulo ', contentHtml: '<p>Texto</p>', excerpt: ' ', imageUrl: '', metaDescription: '', categoryId: '', status: 'PUBLISHED', id: 'forbidden' });
  assert.deepEqual(result, { title: 'Título', slug: 'titulo', contentHtml: '<p>Texto</p>', excerpt: null, imageUrl: null, metaDescription: null, categoryId: null });
});

test('API usa cookie include e notifica sessão inválida no 401', async (t) => {
  let expired = false;
  api.onUnauthorized(() => { expired = true; });
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/blog/v1/auth/me');
    assert.equal(options.credentials, 'include');
    assert.equal(options.headers.Authorization, undefined);
    return new Response(null, { status: 401 });
  });
  await assert.rejects(api.getAdminIdentity(), (e) => e instanceof AdminApiError && e.status === 401);
  assert.equal(expired, true);
});

test('exclusão aceita 204 sem tentar ler JSON', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, '/api/blog/v1/admin/posts/test-id');
    assert.equal(options.method, 'DELETE');
    return new Response(null, { status: 204 });
  });
  assert.equal(await api.deletePost('test-id'), undefined);
});
