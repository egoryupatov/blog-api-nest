import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: any, res: any, next: () => void) {

   const user = await this.usersService.findByToken(req.headers.authorization);

    if (user) {
      next();
    } else {
      throw new HttpException('The token is not valid!', HttpStatus.FORBIDDEN);
    }
  }
}
