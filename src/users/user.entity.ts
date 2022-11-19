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

  @Column({ unique: true })
  token: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  @ManyToMany(() => Article, (article) => article.bannedByUsers)
  @JoinTable()
  bannedArticles: Article[];
}
