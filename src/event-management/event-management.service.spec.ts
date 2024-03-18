import { EventManagementService } from './event-management.service';
import { Event } from './entities/event.entity';
import { City } from './entities/city.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { CreateCityDto } from './dto/create-city.dto';

describe('EventManagementService', () => {
  let service: EventManagementService;
  let eventRepository: Repository<Event>;
  let cityRepository: Repository<City>;
  let entityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventManagementService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(City),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EventManagementService>(EventManagementService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
    entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findEvents', () => {
    it('should return all events', async () => {
      const events: Event[] = [
        new Event({
          id: 1,
          name: 'Taylor Swift',
          price: 150,
          city: {
            id: 1,
            cityName: 'New York',
            countryName: 'united state',
            events: [],
          },
        }),
        new Event({
          id: 2,
          name: 'BTS',
          price: 120,
          city: {
            id: 1,
            cityName: 'New York',
            countryName: 'united state',
            events: [],
          },
        }),
      ];
      jest.spyOn(eventRepository, 'find').mockResolvedValue(events);

      const result = await service.findEvents();

      expect(result).toEqual(events);
    });
  });

  describe('findEvent', () => {
    it('should return an event by ID', async () => {
      const event: Event = new Event({
        id: 1,
        name: 'Taylor Swift',
        price: 150,
        city: {
          id: 1,
          cityName: 'New York',
          countryName: 'united state',
          events: [],
        },
      });
      jest.spyOn(eventRepository, 'findOne').mockResolvedValue(event);

      const result = await service.findEvent(1);

      expect(result).toEqual(event);
    });
  });

  describe('createEvents', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        city: 'Test City',
        price: 100,
      };
      const city: City = new City({
        cityName: 'New York',
        countryName: 'united state',
      });

      jest.spyOn(cityRepository, 'findOne').mockResolvedValue(city);

      const event: Event = new Event({
        id: 1,
        name: createEventDto.name,
        price: createEventDto.price,
        city: {
          id: 1,
          ...city,
        },
      });

      jest.spyOn(entityManager, 'save').mockResolvedValue(event);

      const result = await service.createEvents(createEventDto);

      expect(result).toEqual(event);
    });
  });

  describe('createCity', () => {
    it('should create a new city', async () => {
      const createCityDto: CreateCityDto = {
        cityName: 'Test City',
        countryName: 'Test Country',
      };
      const city: City = new City(createCityDto);
      jest.spyOn(entityManager, 'save').mockResolvedValue({ id: 1, ...city });

      const result = await service.createCity(createCityDto);

      expect(result).toEqual({ id: 1, ...city });
    });
  });

  describe('findCity', () => {
    it('should return a city by ID', async () => {
      const city: City = new City({
        id: 1,
        cityName: 'Test City',
        countryName: 'Test Country',
      });
      jest.spyOn(cityRepository, 'findOne').mockResolvedValue(city);

      const result = await service.findCity(1);

      expect(result).toEqual(city);
    });
  });
});
