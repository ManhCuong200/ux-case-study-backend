import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    constructor(configService: ConfigService);
    analyzeScreen(imageUrl: string): Promise<any>;
}
