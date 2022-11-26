import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Article } from '../posts/article.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Article) private postsRepository: Repository<Article>,
  ) {}

  async findOne(login: string, password: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({
      login: login,
      password: password,
    });
  }

  async findByToken(token: string): Promise<User | undefined> {
    return this.usersRepository.findOneByOrFail({
      token: token,
    });
  }

  async hidePost(data) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: data.userId },
      relations: {
        bannedArticles: true,
      },
    });

    const article = await this.postsRepository.findOneOrFail({
      where: { id: data.articleId },
      relations: {
        bannedByUsers: true,
      },
    });

    user.bannedArticles = [...user.bannedArticles, article];

    await this.usersRepository.save(user);
  }
}
