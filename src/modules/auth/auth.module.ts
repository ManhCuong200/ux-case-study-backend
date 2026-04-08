import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PasswordReset } from './entities/password-reset.entity';

@Module({
    imports: [
        // 1. Kết nối với module Users
        UsersModule,
        PassportModule,
        TypeOrmModule.forFeature([PasswordReset]),

        // 2. Cấu hình JWT
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_ACCESS_SECRET') || 'access_secret_key',
                signOptions: { expiresIn: '15m' },
            }),
            inject: [ConfigService],
            global: true,
        }),

        /*
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                console.log('--- MAIL CONFIG DEBUG ---');
                console.log('User:', config.get('MAIL_USER'));
                console.log('Pass Length:', config.get('MAIL_PASS')?.length);
                console.log('-------------------------');
                return {
                    transport: {
                        service: 'gmail',
                        auth: {
                            user: config.get<string>('MAIL_USER'),
                            pass: config.get<string>('MAIL_PASS'),
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    },
                    defaults: {
                        from: config.get('MAIL_FROM'),
                    },
                };
            },
            inject: [ConfigService],
        }),
        */
],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }