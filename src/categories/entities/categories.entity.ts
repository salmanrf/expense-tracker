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

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('increment')
  category_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  @Check('length(name) >= 3 AND length(name) < 100')
  name: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => UserEntity, (usr) => usr.categories)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp without time zone', nullable: false })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: false })
  updated_at: Date | string;
}
