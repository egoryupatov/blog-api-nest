import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { Article } from '../posts/article.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Article)
    private postsRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllComments() {
    return this.commentsRepository.find({
      relations: {
        article: {
          category: true,
        },
        author: true,
      },
    });
  }

  async getPostComments(postId: number) {
    const comments = await this.commentsRepository.find({
      relations: ['article', 'author', 'children'],
      where: {
        article: {
          id: postId,
        },
        parent: IsNull(),
      },
    });

    return comments;
  }

  async getCommentChildren(parentCommentId: number) {
    const parentComment = await this.commentsRepository.findOne({
      where: {
        id: parentCommentId,
      },
      relations: ['author', 'article'],
    });

    const children = await this.commentsRepository.manager
      .getTreeRepository(Comment)
      .findDescendantsTree(parentComment, {
        relations: ['author', 'article'],
      });

    return children;
  }

  async getUserComments(id) {
    const comments = await this.commentsRepository.find({
      relations: {
        article: {
          category: true,
        },
      },
      where: {
        author: id,
      },
    });
    return comments;
  }

  async addComment(data: Comment, id: number) {
    const post = await this.postsRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        comments: true,
        author: true,
      },
    });

    const comment = new Comment();

    comment.article = post;
    comment.text = data.text;
    comment.author = data.author;
    comment.parent = null;

    await this.commentsRepository.save(comment);
  }

  async addAnswer(data: Comment, parentCommentId: number) {
    const parentComment = await this.commentsRepository.findOne({
      where: {
        id: parentCommentId,
      },
    });

    const answer = new Comment();

    answer.article = data.article;
    answer.text = data.text;
    answer.author = data.author;
    answer.parent = parentComment;

    await this.commentsRepository.save(answer);
  }

  async incrementRating(id: number) {
    const comment = await this.commentsRepository.findOne({
      relations: {
        author: true,
      },
      where: {
        id: id,
      },
    });

    const user = await this.usersRepository.findOne({
      where: { id: comment.author.id },
    });

    await this.commentsRepository.increment({ id: comment.id }, 'rating', 1);
    await this.usersRepository.increment({ id: user.id }, 'rating', 1);
  }

  async decrementRating(id: number) {
    const comment = await this.commentsRepository.findOne({
      relations: {
        author: true,
      },
      where: {
        id: id,
      },
    });

    const user = await this.usersRepository.findOne({
      where: { id: comment.author.id },
    });

    await this.commentsRepository.decrement({ id: comment.id }, 'rating', 1);
    await this.usersRepository.decrement({ id: user.id }, 'rating', 1);
  }
}
