import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Article } from '../posts/article.entity';
import { User } from '../users/user.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Article, (article) => article.comments)
  article: Article;

  @ManyToOne(() => User, (user) => user.comments)
  author: User;

  @Column()
  text: string;

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn()
  publishDate: Date;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];

  @ManyToOne(() => Comment, (comment) => comment.children)
  parent: Comment;
}
