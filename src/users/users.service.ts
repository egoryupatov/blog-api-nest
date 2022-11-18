import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(login: string, password: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({
      login: login,
      password: password,
    });
  }

  async findByToken(token: string): Promise<User | undefined> {
    return this.usersRepository.findOneBy({
      token: token,
    });
  }
}
