import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventManagementModule } from './event-management/event-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    EventManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
