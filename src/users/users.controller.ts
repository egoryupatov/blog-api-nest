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

@Controller({ path: '/users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getLoggedUserInfo(@Param() param) {
    return this.usersService.getLoggedUserInfo(Number(param.id));
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
