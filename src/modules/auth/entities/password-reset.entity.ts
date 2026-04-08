import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('password_resets')
export class PasswordReset extends BaseEntity {
    @Column()
    email: string;

    @Column()
    otp: string;

    @Column({ name: 'expires_at' })
    expiresAt: Date;

    @Column({ default: false })
    isUsed: boolean;
}
