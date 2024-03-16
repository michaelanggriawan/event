import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { City } from './entities/city.entity';
import { EventManagementController } from './event-management.controller';
import { EventManagementService } from './event-management.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, City])],
  controllers: [EventManagementController],
  providers: [EventManagementService],
})
export class EventManagementModule {}
