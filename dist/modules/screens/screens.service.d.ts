import { Repository } from 'typeorm';
import { Screen } from './entities/screen.entity';
import { CreateScreenDto } from './dto/create-screen.dto';
export declare class ScreensService {
    private readonly screenRepository;
    constructor(screenRepository: Repository<Screen>);
    create(createScreenDto: CreateScreenDto): Promise<Screen>;
    findAllByApp(appId: number): Promise<Screen[]>;
    findOne(id: number): Promise<Screen | null>;
    update(id: number, data: Partial<CreateScreenDto>): Promise<Screen>;
    remove(id: number): Promise<Screen>;
}
