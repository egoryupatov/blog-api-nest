import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comments.entity';

@Controller({ path: '/comments' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('posts/:id')
  async getPostComments(@Param('id') id: string) {
    return this.commentsService.getPostComments(Number(id));
  }

  @Get('answers/:id')
  async getAnswers(@Param('id') id: string) {
    return this.commentsService.getAnswers(Number(id));
  }

  @Get('live')
  async getLiveComments() {
    return this.commentsService.getLiveComments();
  }

  /* Old */

  @Get('single/:id')
  async getSingleComment(@Param('id') id: string) {
    return this.commentsService.getSingleComment(Number(id));
  }

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return this.commentsService.getAllComments();
  }

  @Get('user/:id')
  async getUserComments(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.getUserComments(Number(id));
  }

  @Post('add')
  async addComment(@Body() data: Comment) {
    await this.commentsService.addComment(data);
  }

  @Post(':id/answer')
  async answer(@Body() data: Comment, @Param('id') id: string) {
    await this.commentsService.addAnswer(data, Number(id));
  }

  @Post(':id/increment')
  async incrementRating(@Param('id') id: string) {
    return this.commentsService.incrementRating(Number(id));
  }

  @Post(':id/decrement')
  async decrementRating(@Param('id') id: string) {
    return this.commentsService.decrementRating(Number(id));
  }
}
