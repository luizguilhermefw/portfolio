import type { CookieOptions } from 'express';

export const SESSION_COOKIE_NAME = 'blog_session';
export const SESSION_COOKIE_PATH = '/api/blog/v1';
export function sessionTtlMs(): number {
  const days = Number(process.env.SESSION_TTL_DAYS ?? 7);
  if (!Number.isInteger(days) || days < 1 || days > 30) {
    throw new Error('SESSION_TTL_DAYS must be an integer from 1 to 30');
  }
  return days * 24 * 60 * 60 * 1000;
}
export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true, sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production', path: SESSION_COOKIE_PATH,
  };
}
