import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PostsController } from './posts.controller.js';
import { PostsService } from './posts.service.js';

@Module({ imports: [PrismaModule], controllers: [PostsController], providers: [PostsService] })
export class PostsModule {}
