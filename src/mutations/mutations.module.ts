import { Module } from '@nestjs/common';
import { MutationsService } from './mutations.service';
import { MutationsController } from './mutations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MutationEntity } from './entities/mutations.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([MutationEntity]), UsersModule],
  controllers: [MutationsController],
  providers: [MutationsService],
  exports: [MutationsService],
})
export class MutationsModule {}
