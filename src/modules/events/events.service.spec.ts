import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { RedisService } from '@database/redis/redis.service';
import { Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { TypeEvent } from '@common/enums/type-event.enum';
import { UpdateUserDto } from '@modules/users/dto';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let redisService: RedisService;

  const mockRedisService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  };

  const mockEventRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useValue: mockEventRepository
        },
        {
          provide: RedisService,
          useValue: mockRedisService
        }
      ]
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should throw a ConflictException if an event with the same title already exists', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(new Event());
      const dto: CreateEventDto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10,
        type: TypeEvent.SOLO
      };

      await expect(service.create(dto)).rejects.toThrow();
    });

    it('should successfully create a new event', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(undefined);
      mockEventRepository.create.mockImplementation(dto => dto);
      mockEventRepository.save.mockImplementation(event => Promise.resolve({ id: 1, ...event }));

      const dto: CreateEventDto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10,
        type: TypeEvent.SOLO
      };
      const result = await service.create(dto);

      expect(result).toEqual(expect.objectContaining(dto));
    });
  });

  describe('findAll', () => {
    it('should return a list of events', async () => {
      const eventsArray = [{ id: 1, title: 'Test' }];
      mockRedisService.get.mockResolvedValue(null); // Simulate cache miss
      mockEventRepository.find.mockResolvedValue(eventsArray);

      const events = await service.findAll();
      expect(events).toEqual(eventsArray);
      expect(mockRedisService.set).toHaveBeenCalledWith(
        'events_all',
        JSON.stringify(eventsArray),
        3600
      );
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const event = { id: 1, title: 'Test' };
      mockRedisService.get.mockResolvedValue(null); // Simulate cache miss
      mockEventRepository.findOneBy.mockResolvedValue(event);

      const result = await service.findOne(1);
      expect(result).toEqual(event);
      expect(mockRedisService.set).toHaveBeenCalledWith(`event_${1}`, JSON.stringify(event), 3600);
    });
    it('should throw a NotFoundException if the event does not exist', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockEventRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.findOne(1)).rejects.toThrow();
    });
  });

  // FIX: Correct the test description
  describe('update', () => {
    it('should successfully update an event', async () => {
      const event = { id: 1, title: 'Test' };
      mockEventRepository.findOneBy.mockImplementation((condition: any) =>
        condition.title !== 'Test' ? undefined : event
      );
      mockEventRepository.save.mockResolvedValue(event);

      const dto: UpdateEventDto = {
        title: 'Test Updated',
        description: 'Desc Updated',
        price: 150,
        quantityAvailable: 15,
        type: TypeEvent.SOLO
      };

      const result = await service.update(1, dto);

      expect(result).toEqual(expect.objectContaining(dto));
      expect(mockRedisService.del).toHaveBeenCalledWith(`event_${1}`);
      expect(mockRedisService.del).toHaveBeenCalledWith('events_all');
    });

    it('should throw a NotFoundException if the event does not exist in cache', async () => {
      mockRedisService.get.mockResolvedValue(null);
      mockEventRepository.findOneBy.mockResolvedValue(undefined);
      await expect(service.update(1, {} as CreateEventDto)).rejects.toThrow();
    });
  });
});
