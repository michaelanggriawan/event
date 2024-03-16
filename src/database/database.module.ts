import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Can add more database type
type DatabaseType = 'mysql' | 'sqlite';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const type = configService.getOrThrow('TYPE') as DatabaseType;
        if (type === 'sqlite') {
          return {
            type,
            database: 'db/sql.sqlite',
            synchronize: Boolean(configService.getOrThrow('SYNCHRONIZE')),
            autoLoadEntities: true,
          };
        }

        return {
          type,
          host: configService.getOrThrow('HOST'),
          port: configService.getOrThrow('PORT'),
          database: configService.getOrThrow('DATABASE'),
          username: configService.getOrThrow('USERNAME'),
          password: configService.getOrThrow('PASSWORD'),
          autoLoadEntities: true,
          synchronize: configService.getOrThrow('SYNCHRONIZE'),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
