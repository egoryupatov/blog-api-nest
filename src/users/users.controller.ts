import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Article } from '../posts/article.entity';
import { User } from './user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async auth(@Body() data) {
    const user = await this.usersService.findOne(data.login, data.password);

    if (user) {
      return { token: user.token, id: user.id };
    } else {
      throw new HttpException('There is no such user!', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/token')
  async findUserByToken(@Headers() headers) {
    const user = await this.usersService.findByToken(headers.authorization);

    if (user) {
      return user;
    } else {
      throw new HttpException('There is no such user!', HttpStatus.NOT_FOUND);
    }
  }

  @Post('/hide')
  async banPost(@Body() userId: number, postId: number) {
    await this.usersService.hidePost(userId, postId);
  }
}
