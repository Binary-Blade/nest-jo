import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { RedisService } from '@database/redis/redis.service';
import { EventPricesService } from './event-prices.service';
import { ConvertUtilsService } from '@utils/services/convert-utils.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;
  let redisService: RedisService;
  let eventPricesService: EventPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository
        },
        {
          provide: RedisService,
          useValue: {
            fetchCachedData: jest.fn(),
            clearCacheEvent: jest.fn()
          }
        },
        {
          provide: EventPricesService,
          useValue: {
            createEventPrices: jest.fn(),
            updateEventPrices: jest.fn(),
            deleteEventPrices: jest.fn()
          }
        },
        {
          provide: ConvertUtilsService,
          useValue: {
            convertDateStringToDate: jest.fn().mockImplementation(date => new Date(date))
          }
        }
      ]
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    redisService = module.get<RedisService>(RedisService);
    eventPricesService = module.get<EventPricesService>(EventPricesService);
  });

  describe('create', () => {
    const createEventDto: CreateEventDto = {
      title: 'Test Event',
      description: 'Test Description',
      categoryType: CategoryEventTypeEnum.CYCLING,
      basePrice: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-02',
      quantityAvailable: 100
    };

    it('should create an event successfully', async () => {
      const event = new Event();
      event.eventId = 1;
      event.basePrice = 100;

      jest.spyOn(eventRepository, 'create').mockReturnValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
      jest.spyOn(eventPricesService, 'createEventPrices').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'clearCacheEvent').mockResolvedValue(undefined);
      jest.spyOn(service, 'ensureTitleUnique').mockResolvedValue();

      const result = await service.create(createEventDto);
      expect(result).toEqual(event);
      expect(eventRepository.create).toHaveBeenCalledWith(expect.objectContaining(createEventDto));
      expect(eventRepository.save).toHaveBeenCalledWith(event);
      expect(eventPricesService.createEventPrices).toHaveBeenCalledWith(
        event.eventId,
        event.basePrice
      );
      expect(redisService.clearCacheEvent).toHaveBeenCalled();
    });

    it('should throw ConflictException if the title is not unique', async () => {
      jest
        .spyOn(service, 'ensureTitleUnique')
        .mockRejectedValue(new ConflictException('An event with this title already exists.'));

      await expect(service.create(createEventDto)).rejects.toThrow(ConflictException);
    });

    it('should handle database errors during event creation', async () => {
      jest.spyOn(eventRepository, 'save').mockRejectedValue(new InternalServerErrorException());
      jest.spyOn(service, 'ensureTitleUnique').mockResolvedValue();

      await expect(service.create(createEventDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all events successfully', async () => {
      const events = [{} as Event];

      jest.spyOn(redisService, 'fetchCachedData').mockResolvedValue(events);

      const result = await service.findAll();
      expect(result).toBe(events);
      expect(redisService.fetchCachedData).toHaveBeenCalledWith(
        'events_all',
        expect.any(Function),
        3600
      );
    });

    it('should throw InternalServerErrorException if fetching fails', async () => {
      jest
        .spyOn(redisService, 'fetchCachedData')
        .mockRejectedValue(new InternalServerErrorException('Failed to retrieve events.'));

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return an event by ID successfully', async () => {
      const event = {} as Event;

      jest.spyOn(redisService, 'fetchCachedData').mockResolvedValue(event);

      const result = await service.findOne(1);
      expect(result).toBe(event);
      expect(redisService.fetchCachedData).toHaveBeenCalledWith(
        'event_1',
        expect.any(Function),
        3600
      );
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(redisService, 'fetchCachedData').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event successfully', async () => {
      const event = { eventId: 1, basePrice: 100 } as Event;
      const updateEventDto: UpdateEventDto = { title: 'Updated Event', basePrice: 120 };

      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest.spyOn(service as any, 'ensureTitleUnique').mockResolvedValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
      jest.spyOn(eventPricesService, 'updateEventPrices').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'clearCacheEvent').mockResolvedValue(undefined);

      const result = await service.update(1, updateEventDto);
      expect(result).toBe(event);
      expect(service['ensureTitleUnique']).toHaveBeenCalledWith('Updated Event', 1);
      expect(eventPricesService.updateEventPrices).toHaveBeenCalledWith(1, 120);
      expect(redisService.clearCacheEvent).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(1, {} as UpdateEventDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if the title is not unique', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ eventId: 1 } as Event);
      jest.spyOn(service as any, 'ensureTitleUnique').mockRejectedValue(new ConflictException());

      await expect(
        service.update(1, { title: 'Duplicate Event' } as UpdateEventDto)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove an event successfully', async () => {
      const event = { eventId: 1 } as Event;

      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'remove').mockResolvedValue(event);
      jest.spyOn(eventPricesService, 'deleteEventPrices').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'clearCacheEvent').mockResolvedValue(undefined);

      const result = await service.remove(1);
      expect(result).toBe('Event deleted successfully.');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(eventPricesService.deleteEventPrices).toHaveBeenCalledWith(1);
      expect(eventRepository.remove).toHaveBeenCalledWith(event);
      expect(redisService.clearCacheEvent).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
