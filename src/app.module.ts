import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventManagementModule } from './event-management/event-management.module';
import configuration from './config/constant';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    DatabaseModule,
    EventManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
