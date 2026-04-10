import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotspot } from './entities/hotspot.entity';
import { CreateHotspotDto } from './dto/create-hotspot.dto';

@Injectable()
export class HotspotsService {
  constructor(
    @InjectRepository(Hotspot)
    private readonly hotspotRepository: Repository<Hotspot>,
  ) {}

  // Tạo một điểm lỗi (Hotspot) mới
  async create(createHotspotDto: CreateHotspotDto) {
    const hotspot = this.hotspotRepository.create({
      title: createHotspotDto.title,
      content: createHotspotDto.content,
      pos_x: createHotspotDto.pos_x,
      pos_y: createHotspotDto.pos_y,
      type: createHotspotDto.type || 'error', // Mặc định là lỗi nếu không truyền type
      screen: { id: createHotspotDto.screenId } as unknown as Hotspot['screen'], // Gắn ID của màn hình vào đây
    });

    return await this.hotspotRepository.save(hotspot);
  }

  // Lấy tất cả Hotspots của một màn hình cụ thể
  async findAllByScreen(screenId: number) {
    return await this.hotspotRepository.find({
      where: { screen: { id: screenId } },
    });
  }

  // Xóa một Hotspot (nếu chấm nhầm tọa độ)
  async remove(id: number) {
    const hotspot = await this.hotspotRepository.findOne({ where: { id } });
    if (!hotspot) throw new NotFoundException('Không tìm thấy điểm lỗi này');
    return await this.hotspotRepository.remove(hotspot);
  }

  // Cập nhật thông tin Hotspot (tiêu đề, nội dung, etc.)
  async update(id: number, data: Partial<Hotspot>) {
    const hotspot = await this.hotspotRepository.findOne({ where: { id } });
    if (!hotspot) throw new NotFoundException('Không tìm thấy điểm lỗi này');
    Object.assign(hotspot, data);
    return await this.hotspotRepository.save(hotspot);
  }

  async bulkCreate(hotspots: CreateHotspotDto[]) {
    const data = hotspots.map((h) => ({
      ...h,
      screen: { id: h.screenId },
    }));
    const entities = this.hotspotRepository.create(data);
    return await this.hotspotRepository.save(entities);
  }
}
