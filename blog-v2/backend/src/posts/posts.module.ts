import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { AdminPostsController } from './admin-posts.controller.js';

@Module({ imports: [PrismaModule, AuthModule], controllers: [PostsController, AdminPostsController], providers: [PostsService] })
export class PostsModule {}
