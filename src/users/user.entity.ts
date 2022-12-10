import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { Article } from '../posts/article.entity';
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

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @ManyToMany(() => Article, (article) => article.bannedByUsers, {
    cascade: true,
  })
  @JoinTable({ name: 'bannedArticles' })
  bannedArticles: Article[];

  //2 штуки many to many на подписки
}
