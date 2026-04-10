import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { HotspotsService } from './hotspots.service';
import { CreateHotspotDto } from './dto/create-hotspot.dto';

@Controller('hotspots')
export class HotspotsController {
  constructor(private readonly hotspotsService: HotspotsService) {}

  @Post()
  create(@Body() createHotspotDto: CreateHotspotDto) {
    return this.hotspotsService.create(createHotspotDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateHotspotDto>) {
    return this.hotspotsService.update(+id, data);
  }

  @Post('bulk')
  bulkCreate(@Body() hotspots: CreateHotspotDto[]) {
    return this.hotspotsService.bulkCreate(hotspots);
  }

  @Get('screen/:screenId')
  findAllByScreen(@Param('screenId') screenId: string) {
    return this.hotspotsService.findAllByScreen(+screenId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotspotsService.remove(+id);
  }
}
