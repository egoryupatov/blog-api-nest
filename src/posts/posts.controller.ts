import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Article } from './article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller({ path: '/posts' })
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('all')
  async getAllPostsWithoutBanned(@Req() request): Promise<Article[]> {
    return this.postsService.getAllPostsWithoutBanned(request.user?.id);
  }

  @Get('banned')
  async getBannedPosts(@Req() request): Promise<Article[]> {
    return this.postsService.getBannedPosts(request.user?.id);
  }

  @Get(':category/:id')
  async getSinglePost(@Param('id') id: string): Promise<Article> {
    return this.postsService.getSinglePost(Number(id));
  }

  @Get(':category')
  async getPostsByCategory(
    @Param('category') category: string,
  ): Promise<Article[]> {
    return this.postsService.getPostsByCategory(category);
  }

  @Post()
  addPost(@Body() data: Article) {
    return this.postsService.addPost(data);
  }

  @Post('/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + extname(file.originalname),
          );
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return JSON.stringify(file.filename);
  }

  /*  @Put(':id')
  @UseGuards(AuthGuard)
  async editPost(@Param('id') id: string, @Body() data: Article) {
    await this.postsService.editPost(Number(id), data);
  }*/

  @Delete()
  async deletePost(@Body() id: number) {
    await this.postsService.deletePost(id);
  }

  @Post('rating/increment')
  async incrementRating(@Body() body) {
    return this.postsService.incrementRating(Number(body.id));
  }

  @Post('rating/decrement')
  async decrementRating(@Body() body) {
    return this.postsService.decrementRating(Number(body.id));
  }
}
