import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { AuthController } from './auth.controller.js';

@Module({
  imports: [PrismaModule], controllers: [AuthController],
  providers: [AuthService, AuthGuard], exports: [AuthGuard, AuthService],
})
export class AuthModule {}
