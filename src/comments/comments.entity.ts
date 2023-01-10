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
import { BlogPost } from '../posts/blogPost.entity';
import { User } from '../users/user.entity';
import { Category } from '../category/category.entity';

@Entity()
@Tree('nested-set')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.comments)
  blogPost: BlogPost;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

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
