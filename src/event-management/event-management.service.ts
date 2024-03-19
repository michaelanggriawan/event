import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from './entities/city.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventManagementService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    private readonly entityManager: EntityManager,
  ) {}

  async findEvents() {
    return await this.eventRepository.find({
      relations: {
        city: true,
      },
    });
  }

  async findEvent(id: number) {
    const response = await this.eventRepository.findOne({
      where: { id },
      relations: { city: true },
    });

    if (!response) {
      throw new NotFoundException('Event is not exist');
    }

    return response;
  }

  async createEvents(createEventDto: CreateEventDto) {
    const city = await this.cityRepository.findOne({
      where: {
        cityName: createEventDto.city.toLowerCase(),
      },
    });

    if (!city) {
      throw new NotFoundException('City is not found');
    }

    const isEventExist = await this.eventRepository.findOne({
      where: { name: createEventDto.name.toLowerCase() },
    });

    if (isEventExist) {
      throw new ConflictException(`${createEventDto.name} already created`);
    }

    const event = new Event({
      name: createEventDto.name.toLowerCase(),
      city: city,
      price: createEventDto.price,
    });

    const response = await this.entityManager.save(event);

    return response;
  }

  async createCity(createCityDto: CreateCityDto) {
    const isCityExist = await this.cityRepository.findOne({
      where: {
        countryName: createCityDto.countryName.toLowerCase(),
        cityName: createCityDto.cityName.toLowerCase(),
      },
    });

    if (isCityExist) {
      throw new ConflictException(`the city in this country already created`);
    }

    const city = new City({
      countryName: createCityDto.countryName.toLowerCase(),
      cityName: createCityDto.cityName.toLowerCase(),
    });
    const response = await this.entityManager.save(city);

    return response;
  }

  async findCity(id: number): Promise<City> {
    const city = await this.cityRepository.findOne({
      where: { id },
      relations: {
        events: true,
      },
    });

    if (!city) {
      throw new NotFoundException('City is not found');
    }

    return city;
  }
}
