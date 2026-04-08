import { AiService } from './ai.service';
import { ScreensService } from '../../modules/screens/screens.service';
export declare class AiController {
    private readonly aiService;
    private readonly screensService;
    constructor(aiService: AiService, screensService: ScreensService);
    analyze(screenId: string): Promise<any>;
}
