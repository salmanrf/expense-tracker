import { CategoryEntity } from 'src/categories/entities/categories.entity';
import { MutationEntity } from 'src/mutations/entities/mutations.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  @Check("phone_id NOT LIKE '%[^0-9]%'")
  phone_id: string;

  mutations: MutationEntity[];

  @OneToMany(() => CategoryEntity, (cat) => cat.user)
  categories: CategoryEntity[];

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;
}
