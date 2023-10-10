import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn({ type: 'int8' })
  category_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  @Check('length(name) > 3 AND length(name) < 100')
  name: string;

  @CreateDateColumn({ type: 'timestamp without time zone', nullable: false })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: false })
  updated_at: Date | string;
}
