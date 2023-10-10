import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getOrCreateUser(createDto: CreateUserDto) {
    try {
      let user: UserEntity = await this.userRepo.findOne({
        where: { phone_id: createDto.phone_id },
      });

      if (!user) {
        user = await this.userRepo.save(createDto);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
