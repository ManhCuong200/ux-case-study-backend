import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, userData: Partial<User>) {
    await this.userRepository.update(id, userData);
    return this.findOneById(id);
  }
}
