import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EventManagementService } from './event-management.service';
import { CreateCityDto } from './dto/create-city.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  EventsResponse,
  EventResponse,
  EventResponseCreated,
} from './swagger/event.swagger';
import { CityResponse, CityResponseCreated } from './swagger/city.swagger';

@Controller({
  version: '1',
  path: 'event-management',
})
export class EventManagementController {
  constructor(
    private readonly eventManagementService: EventManagementService,
  ) {}

  @Get('/events')
  @ApiOkResponse({ type: EventsResponse })
  findEvents() {
    return this.eventManagementService.findEvents();
  }

  @Get('/events/:id')
  @ApiOkResponse({ type: EventResponse })
  async findEvent(@Param('id') id: string) {
    return this.eventManagementService.findEvent(+id);
  }

  @Post('/events')
  @ApiCreatedResponse({ type: EventResponseCreated })
  createEvents(@Body() createEventsDto: CreateEventDto) {
    return this.eventManagementService.createEvents({
      ...createEventsDto,
    });
  }

  @Post('/cities')
  @ApiOkResponse({ type: CityResponseCreated })
  createCity(@Body() createCityDto: CreateCityDto) {
    return this.eventManagementService.createCity({ ...createCityDto });
  }

  @Get('/cities/:id')
  @ApiOkResponse({ type: CityResponse })
  findCity(@Param('id') id: string) {
    return this.eventManagementService.findCity(+id);
  }
}
