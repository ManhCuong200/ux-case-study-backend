import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App } from './entities/app.entity';
import { CreateAppDto } from './dto/create-app.dto';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private appsRepository: Repository<App>,
  ) {}

  create(createAppDto: CreateAppDto) {
    const app = this.appsRepository.create(createAppDto);
    return this.appsRepository.save(app);
  }

  findAll() {
    return this.appsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.appsRepository.findOne({ 
      where: { id },
      relations: ['screens', 'screens.hotspots'] 
    });
  }

  async update(id: number, updateAppDto: Partial<CreateAppDto>) {
    const app = await this.findOne(id);
    if (!app) {
      throw new NotFoundException(`App with ID ${id} not found`);
    }
    Object.assign(app, updateAppDto);
    return this.appsRepository.save(app);
  }

  async remove(id: number) {
    const app = await this.findOne(id);
    if (!app) {
      throw new NotFoundException(`App with ID ${id} not found`);
    }
    return this.appsRepository.remove(app);
  }
}
