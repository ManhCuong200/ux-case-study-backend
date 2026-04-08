import { Repository } from 'typeorm';
import { App } from './entities/app.entity';
import { CreateAppDto } from './dto/create-app.dto';
export declare class AppsService {
    private appsRepository;
    constructor(appsRepository: Repository<App>);
    create(createAppDto: CreateAppDto): Promise<App>;
    findAll(): Promise<App[]>;
    findOne(id: number): Promise<App | null>;
    update(id: number, updateAppDto: Partial<CreateAppDto>): Promise<App>;
    remove(id: number): Promise<App>;
}
