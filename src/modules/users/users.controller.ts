import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Req, Patch, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(AuthGuard('jwt'))
    @Patch('profile')
    async updateProfile(@Req() req, @Body() data: { fullName?: string }) {
        return this.usersService.update(req.user.id, data);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req) {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn file ảnh');
        }
        const avatarUrl = `http://localhost:3000/uploads/${file.filename}`;
        return this.usersService.update(req.user.id, { avatar: avatarUrl });
    }
}
