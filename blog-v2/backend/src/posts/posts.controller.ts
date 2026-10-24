import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findAll() {
    return this.posts.findPublished();
  }
}
