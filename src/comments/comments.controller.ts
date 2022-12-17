import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comments.entity';

@Controller({ path: '/comments' })
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return this.commentsService.getAllComments();
  }

  @Get('post/:id')
  async getPostComments(@Param('id') id: string) {
    return this.commentsService.getPostComments(Number(id));
  }

  @Get('children/:id')
  async getCommentChildren(@Param('id') id: string) {
    return this.commentsService.getCommentChildren(Number(id));
  }

  @Get('user/:id')
  async getUserComments(@Param('id') id: string): Promise<Comment[]> {
    return this.commentsService.getUserComments(Number(id));
  }

  @Post(':id')
  async addComment(@Body() data: Comment, @Param('id') id: string) {
    await this.commentsService.addComment(data, Number(id));
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
