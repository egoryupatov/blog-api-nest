import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const user = await this.usersService.findByToken(
        req.headers.authorization,
      );
      req.user = user;
    } catch (e) {}
    next();
  }
}
