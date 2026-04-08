import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findOneByEmail(email: string): Promise<User | null>;
    findOneById(id: number): Promise<User | null>;
    update(id: number, userData: Partial<User>): Promise<User | null>;
}
