import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  avatar: string;
}
