import { Module } from '@nestjs/common';
import { MutationsService } from './mutations.service';
import { MutationsController } from './mutations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MutationEntity } from './entities/mutations.entity';
import { UsersModule } from 'src/users/users.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MutationEntity]),
    CategoriesModule,
    UsersModule,
  ],
  controllers: [MutationsController],
  providers: [MutationsService],
  exports: [MutationsService],
})
export class MutationsModule {}
