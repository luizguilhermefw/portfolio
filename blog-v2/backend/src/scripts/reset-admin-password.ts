import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { pathToFileURL } from 'node:url';
import { PrismaService } from '../prisma/prisma.service.js';
import { hashPassword } from '../auth/password.js';
import { readPassword } from './read-password.js';

class UsageError extends Error {}

export async function resetAdminPassword(
  prisma: Pick<PrismaService, 'admin' | '$transaction'>,
  username: string,
  prompt: (message: string) => Promise<string> = readPassword,
): Promise<void> {
  if (!/^[a-zA-Z0-9._-]{1,100}$/.test(username)) throw new UsageError('Username inválido');
  const admin = await prisma.admin.findUnique({ where: { username }, select: { id: true } });
  if (!admin) throw new UsageError('Admin não encontrado; nenhum usuário foi criado');
  const password = await prompt('Nova senha (12–1024 caracteres, sem eco): ');
  if (password.length < 12 || password.length > 1024) throw new UsageError('Use de 12 a 1024 caracteres');
  if (password !== await prompt('Confirme a nova senha: ')) throw new UsageError('Senhas diferentes');
  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async (tx) => {
    await tx.admin.update({ where: { id: admin.id }, data: { passwordHash } });
    await tx.adminSession.deleteMany({ where: { adminId: admin.id } });
  });
}

async function main(): Promise<void> {
  if (existsSync('.env')) loadEnvFile('.env');
  const username = process.argv[2];
  if (!username || !/^[a-zA-Z0-9._-]{1,100}$/.test(username) || process.argv.length !== 3) {
    throw new UsageError('Uso: npm run admin:reset-password -- nome-do-admin');
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new UsageError('Use terminal interativo seguro');
  if (!process.env.DATABASE_URL) throw new UsageError('Configure DATABASE_URL');
  const prisma = new PrismaService();
  try {
    await resetAdminPassword(prisma, username);
  } finally { await prisma.$disconnect(); }
  console.log('Senha redefinida e sessões revogadas.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    if (error instanceof UsageError) {
      console.error(error.message);
    } else {
      const safeError = error as {
        name?: unknown;
        code?: unknown;
        constructor?: { name?: string };
      } | null | undefined;
      console.error('Falha técnica ao redefinir senha:', {
        type: safeError?.constructor?.name ?? 'Unknown',
        name: typeof safeError?.name === 'string' ? safeError.name : undefined,
        code: typeof safeError?.code === 'string' ? safeError.code : undefined,
      });
    }
    process.exitCode = 1;
  });
}
