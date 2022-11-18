import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Article } from '../posts/article.entity';
import { AuthMiddleware } from '../auth/auth.middleware';
import { PostsController } from '../posts/posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Article])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}
