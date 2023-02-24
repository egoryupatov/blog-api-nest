import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { BlogPost } from '../posts/entity/blogPost.entity';
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

  async getLiveComments() {
    const liveComments = await this.commentsRepository.find({
      relations: ['user', 'blogPost'],
      take: 6,
    });

    return liveComments.map((comment: any) => ({
      id: comment.id,
      text: comment.text,
      user: {
        id: comment.user.id,
        login: comment.user.login,
        avatar: comment.user.avatar,
      },
      post: {
        id: comment.blogPost.id,
        title: comment.blogPost.title,
      },
    }));
  }

  /* Old */

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

  async getChildComments(parentCommentId: number) {
    const childComments = await this.commentsRepository.find({
      relations: {
        parent: true,
        children: true,
        blogPost: true,
        user: true,
      },
      where: {
        parent: {
          id: parentCommentId,
        },
      },
    });

    return childComments;
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

  async addComment(data: Comment) {
    console.log('data', data);
    const post = await this.postsRepository.findOneBy({
      id: Number(data.blogPost.id),
    });

    const user = await this.usersRepository.findOneBy({
      id: Number(data.user.id),
    });

    const comment = new Comment();

    comment.blogPost = post;
    comment.user = user;
    comment.text = data.text;
    comment.parent = null;
    comment.publishDate = data.publishDate;

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
