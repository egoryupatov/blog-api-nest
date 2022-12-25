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
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToOne(() => Category, (category) => category.articles)
  category: Category;

  @ManyToMany(() => User, (user) => user.bannedArticles)
  bannedByUsers: User[];

  @OneToMany(() => Comment, (comments) => comments.article)
  comments: Comment[];

  @CreateDateColumn()
  publishDate: Date;

  @Column()
  postImage: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  rating: number;

  @Column('text')
  text: string;
}
