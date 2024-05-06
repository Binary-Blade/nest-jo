import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventPrice } from './entities/event-price.entity';
import { Repository } from 'typeorm';
import { RedisService } from '@database/redis/redis.service';
import { UtilsService } from '@common/utils/utils.service';
import { EventPricesService } from './event-prices.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
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
            del: jest.fn()
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
          provide: UtilsService,
          useValue: {
            convertDateStringToDate: jest.fn(date => new Date(date))
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
    it('should create a new event successfully', async () => {
      const createEventDto: CreateEventDto = {
        title: 'Test Event',
        description: 'A test event',
        categoryType: CategoryEventTypeEnum.TENNIS,
        basePrice: 100,
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        quantityAvailable: 100
      };
      const event = {
        eventId: 1,
        title: 'Test Event',
        description: 'A test event',
        categoryType: CategoryEventTypeEnum.TENNIS,
        basePrice: 100,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02'),
        quantityAvailable: 100,
        quantitySold: 0,
        revenueGenerated: 0,
        prices: [],
        orders: [],
        cartItems: [],
        createdAt: new Date(),
        updatedAt: new Date()
      } as Event;

      jest.spyOn(eventRepository, 'create').mockReturnValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
      jest.spyOn(service as any, 'ensureTitleUnique').mockResolvedValue(undefined);
      jest.spyOn(service as any, 'clearCacheEvent').mockResolvedValue(undefined);
      jest.spyOn(eventPricesService, 'createEventPrices').mockResolvedValue(undefined);

      const result = await service.create(createEventDto);
      expect(result).toBe(event);
      expect(eventRepository.create).toHaveBeenCalledWith({
        ...createEventDto,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate)
      });
      expect(eventRepository.save).toHaveBeenCalledWith(event);
      expect(eventPricesService.createEventPrices).toHaveBeenCalledWith(
        event.eventId,
        event.basePrice
      );
      expect(service['clearCacheEvent']).toHaveBeenCalled();
    });

    it('should throw ConflictException if an event with the same title already exists', async () => {
      jest.spyOn(service as any, 'ensureTitleUnique').mockImplementation(() => {
        throw new ConflictException();
      });

      await expect(service.create({ title: 'Duplicate Event' } as CreateEventDto)).rejects.toThrow(
        ConflictException
      );
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
  });

  describe('findOne', () => {
    it('should return a single event successfully', async () => {
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
      const updateEventDto: UpdateEventDto = { basePrice: 200 };

      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest.spyOn(service as any, 'ensureTitleUnique').mockResolvedValue(undefined);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
      jest.spyOn(service as any, 'clearCacheEvent').mockResolvedValue(undefined);
      jest.spyOn(eventPricesService, 'updateEventPrices').mockResolvedValue(undefined);

      const result = await service.update(1, updateEventDto);
      expect(result).toBe(event);
      expect(eventRepository.save).toHaveBeenCalledWith(event);
      expect(eventPricesService.updateEventPrices).toHaveBeenCalledWith(
        event.eventId,
        updateEventDto.basePrice
      );
      expect(service['clearCacheEvent']).toHaveBeenCalledWith(event.eventId);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(
        service.update(1, { title: 'Non-existent Event' } as UpdateEventDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if an event with the same title already exists', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ eventId: 1 } as Event);
      jest.spyOn(service as any, 'ensureTitleUnique').mockImplementation(() => {
        throw new ConflictException();
      });

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
      jest.spyOn(service as any, 'clearCacheEvent').mockResolvedValue(undefined);
      jest.spyOn(eventPricesService, 'deleteEventPrices').mockResolvedValue(undefined);

      const result = await service.remove(1);
      expect(result).toBe('Event deleted successfully.');
      expect(eventRepository.remove).toHaveBeenCalledWith(event);
      expect(service['clearCacheEvent']).toHaveBeenCalledWith(event.eventId);
      expect(eventPricesService.deleteEventPrices).toHaveBeenCalledWith(event.eventId);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
