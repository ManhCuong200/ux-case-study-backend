import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PasswordReset } from './entities/password-reset.entity';
export interface GoogleUserPayload {
    email: string;
    fullName: string;
    avatar: string;
}
export interface TokenPayload {
    sub: number;
    email: string;
}
export declare class AuthService {
    private readonly jwtService;
    private readonly usersService;
    private readonly configService;
    private readonly passwordResetRepository;
    constructor(jwtService: JwtService, usersService: UsersService, configService: ConfigService, passwordResetRepository: Repository<PasswordReset>);
    googleLogin(googleUser: GoogleUserPayload): Promise<{
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
    signUp(email: string, pass: string, fullName: string): Promise<import("../users/entities/user.entity").User>;
    signIn(email: string, pass: string): Promise<{
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
    generateTokens(payload: TokenPayload): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateUserById(userId: number): Promise<import("../users/entities/user.entity").User | null>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, otp: string, pass: string): Promise<{
        message: string;
    }>;
}
