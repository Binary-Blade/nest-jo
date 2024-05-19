import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { RedisService } from '@database/redis/redis.service';
import { EventPricesService } from './event-prices.service';
import { ConvertUtilsService } from '@utils/services/convert-utils.service';
import { QueryHelperService } from '@database/query/query-helper.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { SortOrder } from '@common/enums/sort-order.enum';

describe('EventsService', () => {
  let service: EventsService;
  let eventRepository: Repository<Event>;
  let redisService: RedisService;
  let eventPricesService: EventPricesService;
  let convertUtilsService: ConvertUtilsService;
  let queryHelper: QueryHelperService;

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
            clearCacheEvent: jest.fn(),
            fetchCachedData: jest.fn()
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
            convertDateStringToDate: jest.fn()
          }
        },
        {
          provide: QueryHelperService,
          useValue: {
            buildQueryOptions: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    redisService = module.get<RedisService>(RedisService);
    eventPricesService = module.get<EventPricesService>(EventPricesService);
    convertUtilsService = module.get<ConvertUtilsService>(ConvertUtilsService);
    queryHelper = module.get<QueryHelperService>(QueryHelperService);
  });

  describe('create', () => {
    it('should create and return a new event', async () => {
      const createEventDto: CreateEventDto = {
        title: 'New Event',
        shortDescription: 'Short Description',
        longDescription: 'Long Description',
        categoryType: CategoryEventTypeEnum.BOXING,
        basePrice: 100,
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        quantityAvailable: 100
      };

      const event = {
        ...createEventDto,
        eventId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        prices: [],
        reservationsDetails: [],
        cartItems: [],
        quantitySold: 0,
        revenueGenerated: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-02')
      } as Event;

      jest.spyOn(eventRepository, 'create').mockReturnValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(eventPricesService, 'createEventPrices').mockResolvedValue(undefined);
      jest
        .spyOn(convertUtilsService, 'convertDateStringToDate')
        .mockImplementation(dateString => new Date(dateString));

      const result = await service.create(createEventDto);

      expect(result).toEqual(event);
      expect(eventRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createEventDto,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02')
        })
      );
      expect(eventRepository.save).toHaveBeenCalledWith(event);
      expect(eventPricesService.createEventPrices).toHaveBeenCalledWith(
        event.eventId,
        createEventDto.basePrice
      );
      expect(redisService.clearCacheEvent).toHaveBeenCalled();
    });

    it('should throw ConflictException if event title is not unique', async () => {
      const createEventDto: CreateEventDto = {
        title: 'Existing Event',
        shortDescription: 'Short Description',
        longDescription: 'Long Description',
        categoryType: CategoryEventTypeEnum.BOXING,
        basePrice: 100,
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        quantityAvailable: 100
      };

      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue({ eventId: 1 } as Event);

      await expect(service.create(createEventDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllValues', () => {
    it('should return all events with selected values', async () => {
      const events = [
        {
          eventId: 1,
          quantityAvailable: 100,
          quantitySold: 50,
          revenueGenerated: 5000
        }
      ] as Event[];

      jest.spyOn(eventRepository, 'find').mockResolvedValue(events);

      const result = await service.findAllValues();

      expect(result).toEqual(events);
      expect(eventRepository.find).toHaveBeenCalledWith({
        select: {
          quantityAvailable: true,
          quantitySold: true,
          revenueGenerated: true
        }
      });
    });
  });

  describe('findAllFiltered', () => {
    it('should return filtered events and total count', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortOrder: SortOrder.ASC,
        filterBy: 'categoryType',
        filterValue: 'MUSIC'
      };

      const events = [
        {
          eventId: 1,
          title: 'Music Event',
          categoryType: CategoryEventTypeEnum.BOXING
        }
      ] as Event[];

      jest.spyOn(queryHelper, 'buildQueryOptions').mockReturnValue({});
      jest.spyOn(eventRepository, 'findAndCount').mockResolvedValue([events, 1]);

      const result = await service.findAllFiltered(paginationFilterDto);

      expect(result).toEqual({ events, total: 1 });
      expect(queryHelper.buildQueryOptions).toHaveBeenCalledWith(paginationFilterDto);
      expect(eventRepository.findAndCount).toHaveBeenCalledWith({});
    });

    it('should throw InternalServerErrorException on error', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortOrder: SortOrder.ASC,
        filterBy: 'categoryType',
        filterValue: 'MUSIC'
      };

      jest.spyOn(queryHelper, 'buildQueryOptions').mockReturnValue({});
      jest.spyOn(eventRepository, 'findAndCount').mockRejectedValue(new Error('Database error'));

      await expect(service.findAllFiltered(paginationFilterDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findOne', () => {
    it('should return an event by ID', async () => {
      const event = {
        eventId: 1,
        title: 'Music Event',
        categoryType: CategoryEventTypeEnum.BOXING
      } as Event;

      jest.spyOn(redisService, 'fetchCachedData').mockResolvedValue(event);

      const result = await service.findOne(1);

      expect(result).toEqual(event);
      expect(redisService.fetchCachedData).toHaveBeenCalledWith(
        `event_1`,
        expect.any(Function),
        360
      );
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(redisService, 'fetchCachedData').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const eventId = 1;
      const updateEventDto: UpdateEventDto = { title: 'Updated Event' };
      const event = { eventId, title: 'Test Event', basePrice: 100 } as Event;

      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);
      jest.spyOn(redisService, 'clearCacheEvent').mockResolvedValue(null);

      await service.update(eventId, updateEventDto);

      expect(service.findOne).toHaveBeenCalledWith(eventId);
      expect(eventRepository.findOneBy).toHaveBeenCalledWith({ title: updateEventDto.title });
      expect(eventRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateEventDto));
      expect(redisService.clearCacheEvent).toHaveBeenCalledWith(eventId);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      const updateEventDto: UpdateEventDto = {
        title: 'Updated Event'
      };

      await expect(service.update(1, updateEventDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if event title is not unique', async () => {
      const event = {
        eventId: 1,
        title: 'Old Event'
      } as Event;

      const updateEventDto: UpdateEventDto = {
        title: 'Existing Event'
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue({ eventId: 2 } as Event);

      await expect(service.update(1, updateEventDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove an event by ID', async () => {
      const event = {
        eventId: 1
      } as Event;

      jest.spyOn(service, 'findOne').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'remove').mockResolvedValue(event);
      jest.spyOn(eventPricesService, 'deleteEventPrices').mockResolvedValue(undefined);
      jest.spyOn(redisService, 'clearCacheEvent').mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toBe('Event deleted successfully.');
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(eventRepository.remove).toHaveBeenCalledWith(event);
      expect(eventPricesService.deleteEventPrices).toHaveBeenCalledWith(1);
      expect(redisService.clearCacheEvent).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findEventById', () => {
    it('should return an event by ID', async () => {
      const event = {
        eventId: 1,
        title: 'Music Event',
        categoryType: CategoryEventTypeEnum.BOXING
      } as Event;

      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(event);

      const result = await service.findEventById(1);

      expect(result).toEqual(event);
      expect(eventRepository.findOneBy).toHaveBeenCalledWith({ eventId: 1 });
    });

    it('should throw NotFoundException if event not found', async () => {
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findEventById(1)).rejects.toThrow(NotFoundException);
    });
  });
});
