import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';
import { ScreensService } from '../../modules/screens/screens.service';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly screensService: ScreensService,
  ) { }

  @Get('analyze/:screenId')
  async analyze(@Param('screenId') screenId: string) {
    const screen = await this.screensService.findOne(+screenId);
    if (!screen) {
      throw new BadRequestException('Screen not found');
    }

    try {
      return await this.aiService.analyzeScreen(screen.image_url);
    } catch (e) {
      console.error('AI SCAN FAILED:', e);
      throw new BadRequestException(`AI Scan failure: ${e.message}`);
    }
  }
}
