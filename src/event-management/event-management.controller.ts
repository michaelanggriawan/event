import { Controller, Get } from '@nestjs/common';
import { EventManagementService } from './event-management.service';

@Controller('event-management')
export class EventManagementController {
  constructor(
    private readonly eventManagementService: EventManagementService,
  ) {}

  @Get()
  async findAll() {
    return this.eventManagementService.findAll();
  }
}
