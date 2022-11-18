import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Article) private postsRepository: Repository<Article>,
  ) {}

  getAllPosts(): Promise<Article[]> {
    return this.postsRepository.find();
  }

  async getAllPostsWithoutBanned(userId: number): Promise<Article[]> {
    const posts = await this.postsRepository.find({
      join: { alias: 'users', leftJoin: { users: 'articles.bannedByUsers' } },
      where: (qb: any): any => {
        qb.where('users.id = :userId', { userId });
      },
    });

    return posts;
  }

  getSinglePost(id: number): Promise<Article> {
    return this.postsRepository.findOneBy({ id: id });
  }

  async addPost(post: Article) {
    await this.postsRepository.save(post);
  }

  async editPost(id: number, data: Article) {
    const updatedPost = await this.postsRepository.findOneBy({ id: id });
    await this.postsRepository.update(updatedPost.id, data);
  }

  async deletePost(id: number) {
    await this.postsRepository.delete({ id: id });
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
