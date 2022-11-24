import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Not, In, Repository } from 'typeorm';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Article) private postsRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getAllPosts(): Promise<Article[]> {
    return this.postsRepository.find();
  }

  async getAllPostsWithoutBanned(userId: number): Promise<Article[]> {
    const user = await this.userRepository.findOneOrFail({
      relations: {
        bannedArticles: true,
      },
      where: {
        id: userId,
      },
    });

    const posts = await this.postsRepository.find({
      relations: {
        bannedByUsers: true,
        author: true,
      },
      where: {
        id: Not(In(user.bannedArticles.map((article) => article.id))),
      },
    });

    return posts;
  }

  getSinglePost(id: number): Promise<Article> {
    return this.postsRepository.findOneByOrFail({ id: id });
  }

  async addPost(post: Article) {
    await this.postsRepository.save(post);
  }

  async editPost(id: number, data: Article) {
    const updatedPost = await this.postsRepository.findOneBy({ id: id });
    await this.postsRepository.update(updatedPost.id, data);
  }

  async deletePost(id: number) {
    await this.postsRepository.delete(id);
  }

  async incrementRating(id: number) {
    const post = await this.postsRepository.findOneBy({ id: id });
    await this.postsRepository.increment(post, 'rating', 1);
  }

  async decrementRating(id: number) {
    const post = await this.postsRepository.findOneBy({ id: id });
    await this.postsRepository.decrement(post, 'rating', 1);
  }
}
