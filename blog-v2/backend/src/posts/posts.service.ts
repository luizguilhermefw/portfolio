import { Injectable } from '@nestjs/common';
import { PostStatus } from '../generated/prisma/enums.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      orderBy: [
        { publishedAt: { sort: 'desc', nulls: 'last' } },
        { createdAt: 'desc' },
        { id: 'desc' },
      ],
      select: {
        id: true, title: true, slug: true, excerpt: true, imageUrl: true,
        createdAt: true, updatedAt: true, publishedAt: true,
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }
}
