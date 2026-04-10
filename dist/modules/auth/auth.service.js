"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const password_reset_entity_1 = require("./entities/password-reset.entity");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    jwtService;
    usersService;
    configService;
    passwordResetRepository;
    constructor(jwtService, usersService, configService, passwordResetRepository) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.configService = configService;
        this.passwordResetRepository = passwordResetRepository;
    }
    async googleLogin(googleUser) {
        if (!googleUser) {
            throw new common_1.BadRequestException('Unauthenticated');
        }
        let user = await this.usersService.findOneByEmail(googleUser.email);
        if (!user) {
            user = await this.usersService.create({
                email: googleUser.email,
                fullName: googleUser.fullName,
                avatar: googleUser.avatar,
                password: '',
            });
        }
        else if (googleUser.avatar && user.avatar !== googleUser.avatar) {
            user.avatar = googleUser.avatar;
            await this.usersService.create(user);
        }
        const payload = { sub: user.id, email: user.email };
        const tokens = await this.generateTokens(payload);
        const { password, ...userWithoutPassword } = user;
        return { ...tokens, user: userWithoutPassword };
    }
    async signUp(email, pass, fullName) {
        const userExists = await this.usersService.findOneByEmail(email);
        if (userExists) {
            throw new common_1.BadRequestException('Email này đã tồn tại!');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        return this.usersService.create({
            email,
            password: hashedPassword,
            fullName,
        });
    }
    async signIn(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        const payload = { sub: user.id, email: user.email };
        const tokens = await this.generateTokens(payload);
        const { password, ...userWithoutPassword } = user;
        return { ...tokens, user: userWithoutPassword };
    }
    async generateTokens(payload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET') ||
                    'access_secret_key',
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET') ||
                    'refresh_secret_key',
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES') || '7d',
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET') ||
                    'refresh_secret_key',
            });
            const { iat, exp, ...cleanPayload } = payload;
            return this.generateTokens(cleanPayload);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }
    async validateUserById(userId) {
        return this.usersService.findOneById(userId);
    }
    async forgotPassword(email) {
        console.log('FORGOT PASSWORD REQUEST:', email);
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy tài khoản với email này');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.passwordResetRepository.save({
            email,
            otp,
            expiresAt,
        });
        console.log('OTP GENERATED (MAIL DISABLED):', otp);
        return { message: 'Mã OTP đã được gửi đến email của bạn' };
    }
    async resetPassword(email, otp, pass) {
        const resetData = await this.passwordResetRepository.findOne({
            where: { email, otp, isUsed: false },
            order: { createdAt: 'DESC' },
        });
        if (!resetData) {
            throw new common_1.BadRequestException('Mã OTP không hợp lệ hoặc đã qua sử dụng');
        }
        if (new Date() > resetData.expiresAt) {
            throw new common_1.BadRequestException('Mã OTP đã hết hạn');
        }
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy tài khoản');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        user.password = hashedPassword;
        await this.usersService.create(user);
        resetData.isUsed = true;
        await this.passwordResetRepository.save(resetData);
        return { message: 'Thay đổi mật khẩu thành công!' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(password_reset_entity_1.PasswordReset)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        config_1.ConfigService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map