import { Controller, Get, Param, Post, Body, Delete, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Get()
  findAll() {
    return this.appsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsService.findOne(+id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `app-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any 
  ) {
    const logo_url = file ? `http://localhost:3000/uploads/${file.filename}` : undefined;
    
    return this.appsService.create({
      name: body.name,
      description: body.description,
      logo_url: logo_url
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateAppDto>) {
    return this.appsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsService.remove(+id);
  }
}
