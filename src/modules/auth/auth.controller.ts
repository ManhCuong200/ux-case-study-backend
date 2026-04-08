import { Controller, Post, Body, UnauthorizedException, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    async getProfile(@Req() req: any) {
        return req.user;
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) {
        // Guard initiates the login flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        // Logic sẽ xử lý tìm/tạo user và tạo token
        const result = await this.authService.googleLogin(req.user);
        
        // Chuyển thẳng về trang chủ kèm theo token trên URL
        const frontendUrl = 'http://localhost:5173/';
        res.redirect(`${frontendUrl}?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`);
    }

    @Post('register')
    async signUp(@Body() body: any) {
        return this.authService.signUp(body.email, body.password, body.fullName);
    }

    @Post('login')
    async signIn(@Body() body: any) {
        return this.authService.signIn(body.email, body.password);
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException('Thiếu Refresh Token');
        }
        return this.authService.refreshTokens(refreshToken);
    }

    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: any) {
        return this.authService.resetPassword(body.email, body.otp, body.password);
    }
}
