import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { LoginDto } from './login.dto.js';
import { SESSION_COOKIE_NAME, sessionCookieOptions } from './session.config.js';
import type { AuthRequest } from './auth.types.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login') @HttpCode(200)
  async login(@Body() input: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(input, request.cookies?.[SESSION_COOKIE_NAME]);
    response.cookie(SESSION_COOKIE_NAME, result.token, { ...sessionCookieOptions(), expires: result.expiresAt });
    return result.admin;
  }

  @Get('me') @UseGuards(AuthGuard)
  me(@Req() request: AuthRequest) { return request.auth.admin; }

  @Post('logout') @HttpCode(200) @UseGuards(AuthGuard)
  async logout(@Req() request: AuthRequest, @Res({ passthrough: true }) response: Response) {
    await this.auth.logout(request.auth.sessionId);
    response.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions());
    return { status: 'ok' };
  }
}
