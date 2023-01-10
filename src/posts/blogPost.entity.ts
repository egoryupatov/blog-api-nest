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
} from 'typeorm';
import { User } from '../users/user.entity';
import { Comment } from '../comments/comments.entity';
import { Category } from '../category/category.entity';

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.blogPosts)
  user: User;

  @ManyToOne(() => Category, (category) => category.blogPosts)
  category: Category;

  @ManyToMany(() => User, (user) => user.hiddenBlogPosts)
  bannedByUsers: User[];

  @OneToMany(() => Comment, (comments) => comments.blogPost)
  comments: Comment[];

  @CreateDateColumn()
  publishDate: Date;

  @Column()
  image: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text')
  text: string;

  @Column({ default: 0 })
  rating: number;
}
