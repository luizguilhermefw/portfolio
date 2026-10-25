import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PostStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreatePostDto, UpdatePostDto } from './post.dto.js';
import type { AdminListPostsQueryDto, ListPostsQueryDto } from './list-posts-query.dto.js';

const publicSummary = {
  id: true, title: true, slug: true, excerpt: true, imageUrl: true,
  publishedAt: true, metaDescription: true,
  category: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.PostSelect;

function searchWhere(search?: string): Prisma.PostWhereInput {
  const term = search?.trim();
  return term ? { OR: [
    { title: { contains: term, mode: 'insensitive' } },
    { contentHtml: { contains: term, mode: 'insensitive' } },
  ] } : {};
}
function pagination<T>(items: T[], total: number, page: number, limit: number) {
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: ListPostsQueryDto) {
    const { page, limit } = query;
    const where: Prisma.PostWhereInput = {
      ...searchWhere(query.search), status: PostStatus.PUBLISHED,
      ...(query.category ? { category: { slug: query.category } } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where, select: publicSummary, skip: (page - 1) * limit, take: limit,
        orderBy: [{ publishedAt: { sort: 'desc', nulls: 'last' } }, { id: 'desc' }],
      }),
      this.prisma.post.count({ where }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
    return pagination(items, total, page, limit);
  }

  async findPublicBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      select: { ...publicSummary, contentHtml: true },
    });
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async findAdmin(query: AdminListPostsQueryDto) {
    const { page, limit } = query;
    const where: Prisma.PostWhereInput = {
      ...searchWhere(query.search), ...(query.status ? { status: query.status } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        select: { ...publicSummary, status: true, createdAt: true, updatedAt: true },
      }),
      this.prisma.post.count({ where }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
    return pagination(items, total, page, limit);
  }

  async findAdminById(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  private async validateCategory(categoryId?: string | null) {
    if (categoryId && !await this.prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } })) {
      throw new BadRequestException('Categoria inválida');
    }
  }

  async create(input: CreatePostDto) {
    await this.validateCategory(input.categoryId);
    return this.prisma.post.create({ data: { ...input, status: PostStatus.DRAFT } });
  }

  async update(id: string, input: UpdatePostDto) {
    await this.findAdminById(id);
    await this.validateCategory(input.categoryId);
    return this.prisma.post.update({ where: { id }, data: input });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.post.delete({ where: { id } });
  }

  async publish(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({ where: { id } });
      if (!post) throw new NotFoundException('Post não encontrado');
      if (!post.title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) || !post.contentHtml.trim()) {
        throw new BadRequestException('Título, slug e conteúdo são obrigatórios');
      }
      // Conditional write preserves the first publication for concurrent calls.
      await tx.post.updateMany({
        where: { id, publishedAt: null },
        data: { publishedAt: new Date(), status: PostStatus.PUBLISHED },
      });
      return tx.post.update({ where: { id }, data: { status: PostStatus.PUBLISHED } });
    });
  }

  unpublish(id: string) {
    return this.prisma.post.update({ where: { id }, data: { status: PostStatus.DRAFT } });
  }
}
