import { Body, Controller, Post } from '@nestjs/common';
import { Article } from '../posts/article.entity';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Post()
  async specificUserPosts(@Body() id: number): Promise<Article[]> {
    return this.dashboardService.getSpecificUserPosts(id);
  }
}
