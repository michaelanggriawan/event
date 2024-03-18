import { Test, TestingModule } from '@nestjs/testing';
import { EventManagementController } from './event-management.controller';
import { EventManagementService } from './event-management.service';
import { EntityManager, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { City } from './entities/city.entity';

describe('EventMangementController', () => {
  let controller: EventManagementController;
  let eventManagementService: EventManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventManagementController],
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

    controller = module.get<EventManagementController>(
      EventManagementController,
    );
    eventManagementService = module.get<EventManagementService>(
      EventManagementService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findEvents should return an array of events', async () => {
    const events = [
      {
        id: 1,
        name: 'Taylor Swift',
        price: 150,
        city: {
          id: 1,
          cityName: 'New York',
          countryName: 'united state',
          events: [],
        },
      },
      {
        id: 2,
        name: 'BTS',
        price: 120,
        city: {
          id: 1,
          cityName: 'New York',
          countryName: 'united state',
          events: [],
        },
      },
    ];
    jest.spyOn(eventManagementService, 'findEvents').mockResolvedValue(events);

    expect(await controller.findEvents()).toBe(events);
  });

  it('findEvent should return a single event', async () => {
    const event = {
      id: 1,
      name: 'Taylor Swift',
      price: 150,
      city: {
        id: 1,
        cityName: 'New York',
        countryName: 'united state',
        events: [],
      },
    };
    jest.spyOn(eventManagementService, 'findEvent').mockResolvedValue(event);

    expect(await controller.findEvent('1')).toBe(event);
  });

  it('createEvents should create a new event', async () => {
    const createEvent = {
      name: 'Taylor Swift',
      price: 150,
      city: 'New York',
    };
    const createdEvent = {
      id: 1,
      ...createEvent,
      city: {
        id: 1,
        cityName: 'New York',
        countryName: 'united state',
        events: [],
      },
    };
    jest
      .spyOn(eventManagementService, 'createEvents')
      .mockResolvedValue(createdEvent);

    expect(await controller.createEvents(createEvent)).toBe(createdEvent);
  });

  it('findCity should return a single city', async () => {
    const city = {
      id: 1,
      cityName: 'New York',
      countryName: 'united state',
      events: [],
    };
    jest.spyOn(eventManagementService, 'findCity').mockResolvedValue(city);

    expect(await controller.findCity('1')).toBe(city);
  });

  it('createCity should create a new city', async () => {
    const createCity = {
      cityName: 'New City',
      countryName: 'Country',
    };
    const createdCity = { id: 1, ...createCity, events: [] };
    jest
      .spyOn(eventManagementService, 'createCity')
      .mockResolvedValue(createdCity);

    expect(await controller.createCity(createCity)).toBe(createdCity);
  });
});
