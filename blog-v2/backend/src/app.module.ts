import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { PostsModule } from './posts/posts.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({ imports: [PrismaModule, HealthModule, PostsModule, CategoriesModule, AuthModule] })
export class AppModule {}
