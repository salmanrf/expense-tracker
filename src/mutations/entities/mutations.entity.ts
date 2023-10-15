import { CategoryEntity } from 'src/categories/entities/categories.entity';
import { MUTATION_TYPES } from 'src/constants/mutation';
import { UserEntity } from 'src/users/entities/users.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mutations')
export class MutationEntity {
  @PrimaryGeneratedColumn('uuid')
  mutation_id: string;

  @Column({ type: 'int8', nullable: true })
  category_id: number;

  @Column({ type: 'varchar', length: 3, nullable: false })
  @Check(`type IN (${MUTATION_TYPES.map((t) => `'${t}'`).join(', ')})`)
  type: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'numeric', precision: 18, scale: 4 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => CategoryEntity, (cat) => cat.category_id)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => UserEntity, (usr) => usr.mutations)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone' })
  updated_at: Date | string;
}
