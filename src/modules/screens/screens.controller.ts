import {
  Controller, Post, Get, Param, UseInterceptors, UploadedFile, Body, Patch, Delete
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ScreensService } from './screens.service';

@Controller('screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) { }
  
  @Get('test/health')
  healthTest() {
    return { status: "Blueprint Command Center is Active", time: new Date() };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadScreen(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { name: string; appId: string }
  ) {
    const imageUrl = `http://localhost:3000/uploads/${file.filename}`;

    return this.screensService.create({
      name: body.name,
      image_url: imageUrl,
      appId: +body.appId
    });
  }

  @Get('app/:appId')
  findByApp(@Param('appId') appId: string) {
    return this.screensService.findAllByApp(+appId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.screensService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screensService.remove(+id);
  }
}
