import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogPost } from '../posts/blogPost.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @OneToMany(() => BlogPost, (blogPost) => blogPost.category)
  blogPosts: BlogPost[];
}
