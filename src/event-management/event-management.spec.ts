import { EntityManager, Repository } from 'typeorm';
import { EventManagementService } from './event-management.service';
import { Event } from './entities/event.entity';
import { City } from './entities/city.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EventManagementService', () => {
  let service: EventManagementService;
  let eventRepository: Repository<Event>;
  let cityRepository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventManagementService,
        {
          provide: getRepositoryToken(Event),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(City),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EventManagementService>(EventManagementService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    cityRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findEvents', async () => {
    await service.findEvents();
    expect(eventRepository.find).toHaveBeenCalled();
  });
});
