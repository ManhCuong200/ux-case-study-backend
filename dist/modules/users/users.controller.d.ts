import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateProfile(req: any, data: {
        fullName?: string;
    }): Promise<import("./entities/user.entity").User | null>;
    uploadAvatar(file: Express.Multer.File, req: any): Promise<import("./entities/user.entity").User | null>;
}
