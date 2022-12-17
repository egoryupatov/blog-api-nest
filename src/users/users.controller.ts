import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Headers,
  Post,
  Request,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Article } from '../posts/article.entity';

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/info/:id')
  async getLoggedUserInfo(@Param() param) {
    return this.usersService.getLoggedUserInfo(Number(param.id));
  }

  @Post('/subscribe')
  async subscribeToUser(@Body() body) {
    return this.usersService.subscribeToUser(body.userId, body.subId);
  }

  @Post('/unsubscribe')
  async unsubscribeFromUser(@Body() body) {
    return this.usersService.unsubscribeFromUser(body.userId, body.subId);
  }

  @Post('/hide')
  async hidePost(@Body() data) {
    await this.usersService.hidePost(data);
  }

  @Post('/unhide')
  async unHidePost(@Body() data) {
    await this.usersService.unHidePost(data);
  }
}
