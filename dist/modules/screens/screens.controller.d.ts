import { ScreensService } from './screens.service';
import { CreateScreenDto } from './dto/create-screen.dto';
export declare class ScreensController {
    private readonly screensService;
    constructor(screensService: ScreensService);
    healthTest(): {
        status: string;
        time: Date;
    };
    uploadScreen(file: Express.Multer.File, body: {
        name: string;
        appId: string;
    }): Promise<import("./entities/screen.entity").Screen>;
    findByApp(appId: string): Promise<import("./entities/screen.entity").Screen[]>;
    findOne(id: string): Promise<import("./entities/screen.entity").Screen | null>;
    update(id: string, data: Partial<CreateScreenDto>): Promise<import("./entities/screen.entity").Screen>;
    remove(id: string): Promise<import("./entities/screen.entity").Screen>;
}
