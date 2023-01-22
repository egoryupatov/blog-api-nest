import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { Comment } from './comments/comments.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentsModule } from './comments/comments.module';
import { Category } from './category/category.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BlogPost } from './posts/blogPost.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/pictures',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-cf6d6omn6mplrj0qp710-a',
      username: 'admin',
      port: 5432,
      password: 'wgYLVDAJrzhsuu2c1NpwjOkdK0aAKGHQ',
      database: 'blog_ut14',
      entities: [User, BlogPost, Comment, Category],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot(),
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
