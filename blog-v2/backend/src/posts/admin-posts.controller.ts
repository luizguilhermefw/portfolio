import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { PostsService } from './posts.service.js';
import { CreatePostDto, UpdatePostDto } from './post.dto.js';
import { AdminListPostsQueryDto } from './list-posts-query.dto.js';

@Controller('admin/posts')
@UseGuards(AuthGuard)
export class AdminPostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll(@Query() query: AdminListPostsQueryDto) { return this.posts.findAdmin(query); }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.posts.findAdminById(id); }

  @Post()
  create(@Body() input: CreatePostDto) { return this.posts.create(input); }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() input: UpdatePostDto) { return this.posts.update(id, input); }

  @Delete(':id') @HttpCode(204)
  delete(@Param('id', ParseUUIDPipe) id: string) { return this.posts.delete(id); }

  @Post(':id/publish') @HttpCode(200)
  publish(@Param('id', ParseUUIDPipe) id: string) { return this.posts.publish(id); }

  @Post(':id/unpublish') @HttpCode(200)
  unpublish(@Param('id', ParseUUIDPipe) id: string) { return this.posts.unpublish(id); }
}
