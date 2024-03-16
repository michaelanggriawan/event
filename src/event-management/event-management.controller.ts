import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventManagementService } from './event-management.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('event-management')
export class EventManagementController {
  constructor(
    private readonly eventManagementService: EventManagementService,
  ) {}

  @Get('/events')
  findEvents() {
    return this.eventManagementService.findEvents();
  }

  @Get('/events/:id')
  async findEvent(@Param('id') id: string) {
    return this.eventManagementService.findEvent(+id);
  }

  @Post('/events')
  createEvents(@Body() createEventsDto: CreateEventDto) {
    return this.eventManagementService.createEvents({
      ...createEventsDto,
    });
  }

  @Post('/cities')
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.eventManagementService.createCity({ ...createCityDto });
  }

  @Get('/cities/:id')
  findCity(@Param('id') id: string) {
    return this.eventManagementService.findCity(+id);
  }
}
