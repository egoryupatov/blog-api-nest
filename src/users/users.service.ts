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

  /*  async findOne(login: string, password: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({
      login: login,
      password: password,
    });
  }*/

  async findByLogin(login: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ login: login });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOneBy({ id: id });
  }

  // можно этим одним запросом получать в том числе список постов,комментариев и забанненых постов юзера,
  // правильно ли это или разбить запросы?

  async getUserInfo(body): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({
      where: {
        id: body.id,
      },
      relations: {
        comments: true,
        articles: true,
      },
    });

    return user;
  }

  async hidePost(data) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: data.userId },
      relations: {
        bannedArticles: true,
      },
    });

    const article = await this.postsRepository.findOneOrFail({
      where: { id: data.postId },
      relations: {
        bannedByUsers: true,
      },
    });

    user.bannedArticles = [...user.bannedArticles, article];

    await this.usersRepository.save(user);
  }

  async unHidePost(data) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: data.userId },
      relations: {
        bannedArticles: true,
      },
    });

    user.bannedArticles = user.bannedArticles.filter((e) => {
      return e.id !== data.postId;
    });

    await this.usersRepository.save(user);
  }
}
