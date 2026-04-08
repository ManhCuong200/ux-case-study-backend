import { BaseEntity } from '../../../shared/entities/base.entity';
export declare class PasswordReset extends BaseEntity {
    email: string;
    otp: string;
    expiresAt: Date;
    isUsed: boolean;
}
