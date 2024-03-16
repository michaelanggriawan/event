import { City } from './src/event-management/entities/city.entity';
import { Event } from './src/event-management/entities/event.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: 'db/sql',
  migrations: ['migrations/**'],
  entities: [Event, City],
  synchronize: true,
});
