import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Article } from '../posts/article.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(User) private postsRepository: Repository<Article>,
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

  async hidePost(): Promise<any> {
    const entity = await this.usersRepository.create(new User());
    const entity2 = {
      ...entity,
      bannedArticles: [{ id: 71 }],
    };
    const user = await this.usersRepository.save(entity2);

    await this.usersRepository.manager.softRemove(user);
  }
}
