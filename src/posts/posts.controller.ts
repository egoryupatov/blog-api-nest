import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Article } from './article.entity';

@Controller({ path: '/posts' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async allPosts(): Promise<Article[]> {
    return this.postsService.getAllPosts();
  }

  @Get('banned')
  async allPostsWithoutBanned(@Headers() headers): Promise<Article[]> {
    return this.postsService.getAllPostsWithoutBanned(headers.userId);
  }

  @Get(':id')
  async getSinglePost(@Param('id') id: string): Promise<Article> {
    return this.postsService.getSinglePost(Number(id));
  }

  @Post()
  addPost(@Body() data: Article) {
    return this.postsService.addPost(data);
  }

  @Put(':id')
  async editPost(@Param('id') id: string, @Body() data: Article) {
    await this.postsService.editPost(Number(id), data);
  }

  @Get(':id/rating/increment')
  async incrementRating(@Param('id') id: number) {
    await this.postsService.incrementRating(id);
  }

  @Get(':id/rating/decrement')
  async decrementRating(@Param('id') id: number) {
    await this.postsService.decrementRating(id);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(Number(id));
  }
}
