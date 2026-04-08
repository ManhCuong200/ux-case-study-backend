import { BaseEntity } from '../../../shared/entities/base.entity';
export declare class User extends BaseEntity {
    email: string;
    password: string;
    fullName: string;
    avatar: string;
}
