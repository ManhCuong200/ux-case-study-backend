import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Screen } from './entities/screen.entity';
import { CreateScreenDto } from './dto/create-screen.dto';

@Injectable()
export class ScreensService {
  constructor(
    @InjectRepository(Screen)
    private readonly screenRepository: Repository<Screen>,
  ) {}

  async create(createScreenDto: CreateScreenDto) {
    const screen = this.screenRepository.create({
      name: createScreenDto.name,
      image_url: createScreenDto.image_url,
      app: { id: createScreenDto.appId } as unknown as Screen['app'], // Liên kết với App qua ID
    });
    return await this.screenRepository.save(screen);
  }
  async findAllByApp(appId: number) {
    return await this.screenRepository.find({
      where: { app: { id: appId } },
      relations: ['hotspots'],
    });
  }

  async findOne(id: number) {
    return await this.screenRepository.findOne({
      where: { id },
      relations: ['hotspots', 'app'],
    });
  }

  async update(id: number, data: Partial<CreateScreenDto>) {
    const screen = await this.findOne(id);
    if (!screen) throw new NotFoundException('Screen not found');
    Object.assign(screen, data);
    return await this.screenRepository.save(screen);
  }

  async remove(id: number) {
    const screen = await this.findOne(id);
    if (!screen) throw new NotFoundException('Screen not found');
    return await this.screenRepository.remove(screen);
  }
}
