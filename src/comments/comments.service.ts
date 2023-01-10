import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { BlogPost } from '../posts/blogPost.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(BlogPost)
    private postsRepository: Repository<BlogPost>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllComments() {
    return this.commentsRepository.find({
      relations: {
        blogPost: {
          category: true,
        },
        user: true,
      },
    });
  }

  async getPostComments(postId: number) {
    const comments = await this.commentsRepository.find({
      relations: ['blogPost', 'user', 'children'],
      where: {
        blogPost: {
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
      relations: ['user', 'blogPost'],
    });

    const children = await this.commentsRepository.manager
      .getTreeRepository(Comment)
      .findDescendantsTree(parentComment, {
        relations: ['user', 'blogPost'],
      });

    return children;
  }

  async getUserComments(id) {
    const comments = await this.commentsRepository.find({
      relations: {
        blogPost: {
          category: true,
        },
      },
      where: {
        user: id,
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
        user: true,
      },
    });

    const comment = new Comment();

    comment.blogPost = post;
    comment.text = data.text;
    comment.user = data.user;
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

    answer.blogPost = data.blogPost;
    answer.text = data.text;
    answer.user = data.user;
    answer.parent = parentComment;

    await this.commentsRepository.save(answer);
  }

  async incrementRating(id: number) {
    const comment = await this.commentsRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: id,
      },
    });

    const user = await this.usersRepository.findOne({
      where: { id: comment.user.id },
    });

    await this.commentsRepository.increment({ id: comment.id }, 'rating', 1);
    await this.usersRepository.increment({ id: user.id }, 'rating', 1);
  }

  async decrementRating(id: number) {
    const comment = await this.commentsRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        id: id,
      },
    });

    const user = await this.usersRepository.findOne({
      where: { id: comment.user.id },
    });

    await this.commentsRepository.decrement({ id: comment.id }, 'rating', 1);
    await this.usersRepository.decrement({ id: user.id }, 'rating', 1);
  }
}
