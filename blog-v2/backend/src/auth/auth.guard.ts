import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SESSION_COOKIE_NAME } from './session.config.js';
import type { AuthRequest } from './auth.types.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    request.auth = await this.authService.authenticate(request.cookies?.[SESSION_COOKIE_NAME]);
    return true;
  }
}
