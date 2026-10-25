import { createHash, randomBytes } from 'node:crypto';

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
export function createSessionToken(): string {
  return randomBytes(32).toString('hex');
}
export function isSessionToken(token: unknown): token is string {
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
}
