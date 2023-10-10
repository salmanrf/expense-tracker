import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({ type: 'time without time zone' })
  created_at: Date | string;

  @UpdateDateColumn({ type: 'time without time zone' })
  updated_at: Date | string;
}
