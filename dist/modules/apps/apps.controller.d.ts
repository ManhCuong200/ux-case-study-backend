import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
export declare class AppsController {
    private readonly appsService;
    constructor(appsService: AppsService);
    findAll(): Promise<import("./entities/app.entity").App[]>;
    findOne(id: string): Promise<import("./entities/app.entity").App | null>;
    create(file: Express.Multer.File, body: CreateAppDto): Promise<import("./entities/app.entity").App>;
    update(id: string, body: Partial<CreateAppDto>): Promise<import("./entities/app.entity").App>;
    remove(id: string): Promise<import("./entities/app.entity").App>;
}
