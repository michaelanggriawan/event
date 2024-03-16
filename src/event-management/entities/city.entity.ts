import { Entity, Column, OneToMany } from 'typeorm';
import { Event } from './event.entity';
import { AbstractEntity } from '../../database/abstract.entity';

@Entity()
export class City extends AbstractEntity<City> {
  @Column()
  cityName: string;

  @Column()
  countryName: string;

  @OneToMany(() => Event, (event) => event.city)
  events: Event[];
}
