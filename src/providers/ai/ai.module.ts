import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ScreensModule } from '../../modules/screens/screens.module';

@Module({
  imports: [ScreensModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
