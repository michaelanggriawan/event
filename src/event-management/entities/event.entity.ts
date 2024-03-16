import { Entity, Column, ManyToOne } from 'typeorm';
import { City } from './city.entity';
import { AbstractEntity } from '../../database/abstract.entity';

@Entity()
export class Event extends AbstractEntity<Event> {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => City, (city) => city.events)
  city: City;
}
