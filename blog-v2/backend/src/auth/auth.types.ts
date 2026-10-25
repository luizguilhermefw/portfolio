import type { Request } from 'express';

export interface SessionIdentity {
  sessionId: string;
  admin: { id: string; username: string };
}
export interface AuthRequest extends Request {
  auth: SessionIdentity;
}
