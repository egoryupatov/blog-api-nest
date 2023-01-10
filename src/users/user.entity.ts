import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { BlogPost } from '../posts/blogPost.entity';
import { Comment } from '../comments/comments.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  signUpDate: Date;

  @Column()
  rating: number;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.user)
  blogPosts: BlogPost[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => BlogPost, (blogPost) => blogPost.bannedByUsers, {
    cascade: true,
  })
  @JoinTable({ name: 'hiddenBlogPosts' })
  hiddenBlogPosts: BlogPost[];

  @ManyToMany(() => User, (user) => user.subscriptions)
  @JoinTable({ name: 'subscriptions' })
  subscriptions: User[];

  @ManyToMany(() => User, (user) => user.subscribers)
  @JoinTable({ name: 'subscribers' })
  subscribers: User[];
}
