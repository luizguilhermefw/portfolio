import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { emitKeypressEvents } from 'node:readline';
import { PrismaService } from '../prisma/prisma.service.js';
import { hashPassword } from '../auth/password.js';

function readPassword(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = process.stdin;
    let value = '';
    const wasRaw = input.isRaw;
    process.stdout.write(prompt);
    emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    const cleanup = () => {
      input.removeListener('keypress', onKey);
      input.setRawMode(wasRaw);
      input.pause();
      process.stdout.write('\n');
    };
    const onKey = (text: string | undefined, key: { name?: string; ctrl?: boolean; meta?: boolean }) => {
      if (key?.ctrl && key.name === 'c') { cleanup(); reject(new Error('Cancelado')); return; }
      if (key?.name === 'return') { cleanup(); resolve(value); return; }
      if (key?.name === 'backspace') { value = value.slice(0, -1); return; }
      if (!key?.ctrl && !key?.meta && text && !/[\x00-\x1f\x7f]/.test(text) && value.length + text.length <= 1024) value += text;
    };
    input.on('keypress', onKey);
  });
}

async function main() {
  if (existsSync('.env')) loadEnvFile('.env');
  const username = process.argv[2];
  if (!username || !/^[a-zA-Z0-9._-]{1,100}$/.test(username) || process.argv.length !== 3) {
    throw new Error('Uso: npm run admin:create -- nome-do-admin');
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Use terminal interativo seguro');
  if (!process.env.DATABASE_URL) throw new Error('Configure DATABASE_URL');
  const prisma = new PrismaService();
  try {
    if (await prisma.admin.findUnique({ where: { username }, select: { id: true } })) {
      throw new Error('Admin já existe; senha não foi alterada');
    }
    const password = await readPassword('Senha (12–1024 caracteres, sem eco): ');
    if (password.length < 12) throw new Error('Use pelo menos 12 caracteres');
    if (password !== await readPassword('Confirme a senha: ')) throw new Error('Senhas diferentes');
    await prisma.admin.create({ data: { username, passwordHash: await hashPassword(password) } });
    console.log('Admin criado.');
  } finally { await prisma.$disconnect(); }
}
main().catch(() => {
  console.error('Não foi possível criar o admin. Verifique uso, terminal, senha, usuário existente e configuração do banco.');
  process.exitCode = 1;
});
