import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { createSessionToken, hashSessionToken, isSessionToken } from './session-token.js';
import { hashPassword, verifyPassword } from './password.js';
import { sessionTtlMs } from './session.config.js';
import type { LoginDto } from './login.dto.js';
import type { SessionIdentity } from './auth.types.js';

@Injectable()
export class AuthService {
  private readonly ttl = sessionTtlMs();
  // A random dummy hash avoids skipping password verification for unknown users.
  private readonly dummyHash = hashPassword(createSessionToken());

  constructor(private readonly prisma: PrismaService) {}

  async login(input: LoginDto, previousToken?: unknown) {
    const admin = await this.prisma.admin.findUnique({
      where: { username: input.username },
      select: { id: true, username: true, passwordHash: true },
    });
    const valid = await verifyPassword(admin?.passwordHash ?? await this.dummyHash, input.password);
    if (!admin || !valid) throw new UnauthorizedException('Credenciais inválidas');

    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + this.ttl);
    await this.prisma.$transaction(async (tx) => {
      if (isSessionToken(previousToken)) {
        await tx.adminSession.deleteMany({
          where: { tokenHash: hashSessionToken(previousToken), adminId: admin.id },
        });
      }
      await tx.adminSession.create({
        data: { adminId: admin.id, tokenHash: hashSessionToken(token), expiresAt },
      });
    });
    return { token, expiresAt, admin: { id: admin.id, username: admin.username } };
  }

  async authenticate(token: unknown): Promise<SessionIdentity> {
    if (!isSessionToken(token)) throw new UnauthorizedException();
    const session = await this.prisma.adminSession.findFirst({
      where: { tokenHash: hashSessionToken(token), expiresAt: { gt: new Date() } },
      select: { id: true, admin: { select: { id: true, username: true } } },
    });
    if (!session) throw new UnauthorizedException();
    return { sessionId: session.id, admin: session.admin };
  }

  async logout(sessionId: string): Promise<void> {
    await this.prisma.adminSession.deleteMany({ where: { id: sessionId } });
  }
}
