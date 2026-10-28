import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resetAdminPassword } from '../dist/scripts/reset-admin-password.js';
import { verifyPassword } from '../dist/auth/password.js';

const password = 'test-only-password-123';
function fixture({ exists = true, failDelete = false } = {}) {
  const state = {
    admin: { id: 'admin-1', username: 'luiz', createdAt: 'unchanged', legacyId: 7, passwordHash: 'old' },
    sessions: [{ adminId: 'admin-1' }, { adminId: 'admin-1' }, { adminId: 'other' }],
  };
  const calls = [];
  const prisma = {
    admin: { findUnique: async (args) => {
      assert.deepEqual(args, { where: { username: 'luiz' }, select: { id: true } });
      return exists ? { id: state.admin.id } : null;
    } },
    $transaction: async (callback) => {
      calls.push('transaction');
      const draft = structuredClone(state);
      await callback({
        admin: { update: async (args) => {
          calls.push(args);
          assert.deepEqual(args.where, { id: 'admin-1' });
          assert.deepEqual(Object.keys(args.data), ['passwordHash']);
          Object.assign(draft.admin, args.data);
        } },
        adminSession: { deleteMany: async (args) => {
          calls.push(args);
          assert.deepEqual(args, { where: { adminId: 'admin-1' } });
          if (failDelete) throw new Error('database failure');
          draft.sessions = draft.sessions.filter((s) => s.adminId !== args.where.adminId);
        } },
      });
      Object.assign(state, draft);
    },
  };
  return { prisma, state, calls };
}

test('reset: admin inexistente não cria usuário nem solicita senha', async () => {
  const f = fixture({ exists: false });
  await assert.rejects(resetAdminPassword(f.prisma, 'luiz', async () => assert.fail('unexpected prompt')), /Admin não encontrado/);
  assert.deepEqual(f.calls, []);
});

test('reset: senha curta é rejeitada antes de escrever', async () => {
  const f = fixture();
  await assert.rejects(resetAdminPassword(f.prisma, 'luiz', async () => 'short'), /12 a 1024/);
  assert.deepEqual(f.calls, []);
});

test('reset: confirmação diferente é rejeitada antes de escrever', async () => {
  const f = fixture();
  const answers = [password, 'different-password'];
  await assert.rejects(resetAdminPassword(f.prisma, 'luiz', async () => answers.shift()), /Senhas diferentes/);
  assert.deepEqual(f.calls, []);
});

test('reset: altera somente passwordHash usando Argon2id e revoga todas as sessões do admin', async () => {
  const f = fixture();
  const original = structuredClone(f.state.admin);
  await resetAdminPassword(f.prisma, 'luiz', async () => password);
  assert.match(f.state.admin.passwordHash, /^\$argon2id\$/);
  assert.equal(await verifyPassword(f.state.admin.passwordHash, password), true);
  assert.deepEqual({ ...f.state.admin, passwordHash: original.passwordHash }, original);
  assert.deepEqual(f.state.sessions, [{ adminId: 'other' }]);
  assert.equal(f.calls.length, 3);
});

test('reset: falha na revogação aborta a transação sem estado parcial', async () => {
  const f = fixture({ failDelete: true });
  const before = structuredClone(f.state);
  await assert.rejects(resetAdminPassword(f.prisma, 'luiz', async () => password), /database failure/);
  assert.deepEqual(f.state, before);
});

test('reset: username inválido é rejeitado antes de consultar o banco', async () => {
  await assert.rejects(resetAdminPassword({}, 'invalid user'), /Username inválido/);
});
