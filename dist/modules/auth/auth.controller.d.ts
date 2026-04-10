import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProfile(req: Request): Promise<Express.User | undefined>;
    googleAuth(req: Request): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
    signUp(body: Record<string, string>): Promise<import("../users/entities/user.entity").User>;
    signIn(body: Record<string, string>): Promise<{
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
    resetPassword(body: Record<string, string>): Promise<{
        message: string;
    }>;
}
