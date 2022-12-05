import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Article } from '../posts/article.entity';
import { User } from '../users/user.entity';

@Entity()
@Tree('materialized-path')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.comments, {
    cascade: true,
  })
  article: Article;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @Column()
  text: string;

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn()
  publishDate: Date;

  @TreeChildren()
  children: Comment[];

  @TreeParent()
  parent: Comment;
}
