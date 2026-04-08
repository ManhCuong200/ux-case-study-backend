import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { PasswordReset } from './entities/password-reset.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        // private readonly mailerService: MailerService,
        @InjectRepository(PasswordReset)
        private readonly passwordResetRepository: Repository<PasswordReset>,
    ) { }

    async googleLogin(googleUser: any) {
        if (!googleUser) {
            throw new BadRequestException('Unauthenticated');
        }

        let user = await this.usersService.findOneByEmail(googleUser.email);

        if (!user) {
            // Create user if not exists
            user = await this.usersService.create({
                email: googleUser.email,
                fullName: googleUser.fullName,
                avatar: googleUser.avatar,
                password: '', // Google users might not have a local password
            });
        } else if (googleUser.avatar && user.avatar !== googleUser.avatar) {
            // Update avatar if changed
            user.avatar = googleUser.avatar;
            await this.usersService.create(user); // using create as save
        }

        const payload = { sub: user.id, email: user.email };
        const tokens = await this.generateTokens(payload);
        
        // Trả về cả token và user
        const { password, ...userWithoutPassword } = user;
        return { ...tokens, user: userWithoutPassword };
    }

    // 1. Đăng ký tài khoản mới
    async signUp(email: string, pass: string, fullName: string) {
        const userExists = await this.usersService.findOneByEmail(email);
        if (userExists) {
            throw new BadRequestException('Email này đã tồn tại!');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);

        return this.usersService.create({
            email,
            password: hashedPassword,
            fullName,
        });
    }

    // 2. Đăng nhập và trả về bộ đôi Token
    async signIn(email: string, pass: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }

        const payload = { sub: user.id, email: user.email };
        const tokens = await this.generateTokens(payload);

        // Trả về cả token và user
        const { password, ...userWithoutPassword } = user;
        return { ...tokens, user: userWithoutPassword };
    }

    // 3. Hàm tạo Token (Automation)
    async generateTokens(payload: any) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET') || 'access_secret_key',
                expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRES') || '15m') as any
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh_secret_key',
                expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRES') || '7d') as any
            }),
        ]);

        return { accessToken, refreshToken };
    }

    // 4. Hàm "Tự động cập nhật" - Refresh Token
    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET') || 'refresh_secret_key',
            });

            const { iat, exp, ...cleanPayload } = payload;

            return this.generateTokens(cleanPayload);
        } catch (e) {
            throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }

    async validateUserById(userId: string) {
        return this.usersService.findOneById(Number(userId));
    }

    // 5. Quên mật khẩu - Gửi Mail OTP
    async forgotPassword(email: string) {
        console.log('FORGOT PASSWORD REQUEST:', email);
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('Không tìm thấy tài khoản với email này');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Hết hạn sau 10p

        await this.passwordResetRepository.save({
            email,
            otp,
            expiresAt,
        });

        /*
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: '[ResearchCommand] Mã xác nhận thay đổi mật khẩu',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
                        <h2 style="color: #2563eb; margin-bottom: 16px;">Xác nhận đặt lại mật khẩu</h2>
                        <p style="color: #475569; line-height: 1.5;">Chào bạn,</p>
                        <p style="color: #475569; line-height: 1.5;">Chúng tôi nhận được yêu cầu thay đổi mật khẩu cho tài khoản ${email}. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình này:</p>
                        <div style="background-color: #f8fafc; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b;">${otp}</span>
                        </div>
                        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">Mã này có hiệu lực trong vòng 10 phút. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                        <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2024 ResearchCommand. All rights reserved.</p>
                    </div>
                `,
            });
        } catch (mailError) {
            console.error('MAIL ERROR:', mailError);
            throw new BadRequestException('Không thể gửi email xác thực. Vui lòng kiểm tra cấu hình Mailer.');
        }
        */
        console.log('OTP GENERATED (MAIL DISABLED):', otp);

        return { message: 'Mã OTP đã được gửi đến email của bạn' };
    }

    // 6. Reset mật khẩu với OTP
    async resetPassword(email: string, otp: string, pass: string) {
        const resetData = await this.passwordResetRepository.findOne({
            where: { email, otp, isUsed: false },
            order: { createdAt: 'DESC' }
        });

        if (!resetData) {
            throw new BadRequestException('Mã OTP không hợp lệ hoặc đã qua sử dụng');
        }

        if (new Date() > resetData.expiresAt) {
            throw new BadRequestException('Mã OTP đã hết hạn');
        }

        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('Không tìm thấy tài khoản');
        }

        // Cập nhật mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        
        user.password = hashedPassword;
        await this.usersService.create(user); // using create as save

        // Đánh dấu mã này đã dùng
        resetData.isUsed = true;
        await this.passwordResetRepository.save(resetData);

        return { message: 'Thay đổi mật khẩu thành công!' };
    }
}