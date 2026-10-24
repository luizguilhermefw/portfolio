import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';

@Module({ imports: [PrismaModule], controllers: [CategoriesController], providers: [CategoriesService] })
export class CategoriesModule {}
