import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { RedisService } from '@database/redis/redis.service';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { TypeEvent } from '@common/enums/type-event.enum';

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let redisService: RedisService;

  // Mock services and repositories
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
    const dto: CreateEventDto = {
      title: 'New Year',
      description: 'New Year Celebration',
      basePrice: 50,
      quantityAvailable: 100
    };
    it('should create a new event', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(null);
      mockEventRepository.create.mockImplementation(event => event);
      mockEventRepository.save.mockResolvedValue({ eventId: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toMatchObject({ ...dto });
      expect(mockRedisService.del).toHaveBeenCalledWith('events_all');
    });

    it('should throw a ConflictException for duplicate titles', async () => {
      // Make sure the mocked event has an eventId if necessary
      const existingEvent = new Event();
      existingEvent.eventId = 2; // Set an ID different from what might be used in the creation
      mockEventRepository.findOneBy.mockResolvedValue(existingEvent);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
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
    it('should retrieve an event by ID', async () => {
      const event = { eventId: 1, title: 'Event' };
      mockRedisService.get.mockResolvedValue(null);
      mockEventRepository.findOneBy.mockResolvedValue(event);

      const result = await service.findOne(1);
      expect(result).toEqual(event);
      expect(mockRedisService.set).toHaveBeenCalledWith(`event_${1}`, JSON.stringify(event), 3600);
    });

    it('should throw a NotFoundException if event not found', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const event = { eventId: 1, title: 'Event', basePrice: 100 };
      const updateDto: UpdateEventDto = { title: 'Updated Event', basePrice: 150 };
      mockEventRepository.findOneBy.mockResolvedValue(event);
      mockEventRepository.save.mockResolvedValue({ ...event, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result).toMatchObject(updateDto);
      mockRedisService.del.mockImplementation(key => {
        if (key === 'events_all' || key.startsWith('event_')) return Promise.resolve('OK');
        return Promise.reject('Key does not match');
      });
    });

    it('should throw a NotFoundException if event to update not found', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(1, {} as UpdateEventDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const event = { eventId: 1, title: 'Event' };
      mockEventRepository.findOneBy.mockResolvedValue(event);
      mockEventRepository.remove.mockResolvedValue(event);

      const result = await service.remove(1);
      expect(result).toEqual('Event deleted successfully.');
      expect(mockRedisService.del).toHaveBeenCalledWith(`event_${1}`);
      expect(mockRedisService.del).toHaveBeenCalledWith('events_all');
    });

    it('should throw a NotFoundException if event to remove not found', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPriceByType', () => {
    it('should return the correct price based on the ticket type', async () => {
      const mockEvent = { id: 1, soloPrice: 100, duoPrice: 130, familyPrice: 180 };
      mockEventRepository.findOneBy.mockResolvedValue(mockEvent);

      const soloPrice = await service.getPriceByType(1, TypeEvent.SOLO);
      const duoPrice = await service.getPriceByType(1, TypeEvent.DUO);
      const familyPrice = await service.getPriceByType(1, TypeEvent.FAMILY);

      expect(soloPrice).toEqual(100);
      expect(duoPrice).toEqual(130);
      expect(familyPrice).toEqual(180);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      mockEventRepository.findOneBy.mockResolvedValue(undefined);

      await expect(service.getPriceByType(1, TypeEvent.SOLO)).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException if an invalid ticket type is provided', async () => {
      const mockEvent = { id: 1, soloPrice: 100, duoPrice: 130, familyPrice: 180 };
      mockEventRepository.findOneBy.mockResolvedValue(mockEvent);

      await expect(service.getPriceByType(1, 'invalid')).rejects.toThrow(NotFoundException);
    });
  });
});
