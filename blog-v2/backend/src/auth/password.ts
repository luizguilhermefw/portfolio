import { argon2id, hash, verify } from 'argon2';

export function hashPassword(password: string): Promise<string> {
  return hash(password, { type: argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
}
export async function verifyPassword(encoded: string, password: string): Promise<boolean> {
  if (!encoded.startsWith('$argon2id$')) return false;
  try { return await verify(encoded, password); } catch { return false; }
}
