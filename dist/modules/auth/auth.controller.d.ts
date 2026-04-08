import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProfile(req: any): Promise<any>;
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<void>;
    signUp(body: any): Promise<import("../users/entities/user.entity").User>;
    signIn(body: any): Promise<{
        user: {
            email: string;
            fullName: string;
            avatar: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(body: any): Promise<{
        message: string;
    }>;
}
