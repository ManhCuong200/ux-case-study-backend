import { HotspotsService } from './hotspots.service';
import { CreateHotspotDto } from './dto/create-hotspot.dto';
export declare class HotspotsController {
    private readonly hotspotsService;
    constructor(hotspotsService: HotspotsService);
    create(createHotspotDto: CreateHotspotDto): Promise<import("./entities/hotspot.entity").Hotspot>;
    update(id: string, data: Partial<CreateHotspotDto>): Promise<import("./entities/hotspot.entity").Hotspot>;
    bulkCreate(hotspots: CreateHotspotDto[]): Promise<import("./entities/hotspot.entity").Hotspot[]>;
    findAllByScreen(screenId: string): Promise<import("./entities/hotspot.entity").Hotspot[]>;
    remove(id: string): Promise<import("./entities/hotspot.entity").Hotspot>;
}
