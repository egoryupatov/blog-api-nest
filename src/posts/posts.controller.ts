import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Article } from './article.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller({ path: '/posts' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async allPosts(): Promise<Article[]> {
    return this.postsService.getAllPosts();
  }

  @Get('banned')
  async allPostsWithoutBanned(@Req() request): Promise<Article[]> {
    return this.postsService.getAllPostsWithoutBanned(request.user?.id);
  }

  @Get(':id')
  async getSinglePost(@Param('id') id: string): Promise<Article> {
    return this.postsService.getSinglePost(Number(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  addPost(@Body() data: Article) {
    return this.postsService.addPost(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async editPost(@Param('id') id: string, @Body() data: Article) {
    await this.postsService.editPost(Number(id), data);
  }

  @Get(':id/rating/increment')
  @UseGuards(AuthGuard)
  async incrementRating(@Param('id') id: number) {
    await this.postsService.incrementRating(id);
  }

  @Get(':id/rating/decrement')
  @UseGuards(AuthGuard)
  async decrementRating(@Param('id') id: number) {
    await this.postsService.decrementRating(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(Number(id));
  }
}
