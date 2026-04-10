import { Repository } from 'typeorm';
import { Hotspot } from './entities/hotspot.entity';
import { CreateHotspotDto } from './dto/create-hotspot.dto';
export declare class HotspotsService {
    private readonly hotspotRepository;
    constructor(hotspotRepository: Repository<Hotspot>);
    create(createHotspotDto: CreateHotspotDto): Promise<Hotspot>;
    findAllByScreen(screenId: number): Promise<Hotspot[]>;
    remove(id: number): Promise<Hotspot>;
    update(id: number, data: Partial<Hotspot>): Promise<Hotspot>;
    bulkCreate(hotspots: CreateHotspotDto[]): Promise<Hotspot[]>;
}
