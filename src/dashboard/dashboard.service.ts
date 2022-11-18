import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../posts/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Article) private postsRepository: Repository<Article>,
  ) {}

  getSpecificUserPosts(id): Promise<Article[]> {
    return this.postsRepository.findBy({ author: id });
  }
}
