import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Bạn cần đăng nhập để thực hiện thao tác này');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: 'SECRET_KEY_CUA_CUONG', // Phải khớp với key trong AuthModule
            });

            // Gán thông tin user vào request để dùng ở Controller nếu cần
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Phiên làm việc không hợp lệ hoặc đã hết hạn');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}