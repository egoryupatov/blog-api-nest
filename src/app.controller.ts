import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller({ path: '/apiv3' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  auth(@Body() data) {
    console.log(data);
    return this.appService.getToken();
  }
}
