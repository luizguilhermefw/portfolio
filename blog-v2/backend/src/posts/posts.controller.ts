import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListPostsQueryDto } from './list-posts-query.dto.js';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll(@Query() query: ListPostsQueryDto) {
    return this.posts.findPublished(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { return this.posts.findPublicBySlug(slug); }
}
