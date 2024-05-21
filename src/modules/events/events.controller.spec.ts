import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventPricesService } from './event-prices.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { SortOrder } from '@common/enums/sort-order.enum';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: EventsService;
  let eventPricesService: EventPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            create: jest.fn(),
            findAllFiltered: jest.fn(),
            findAllValues: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          }
        },
        {
          provide: EventPricesService,
          useValue: {
            getPriceByEventAndType: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
    eventPricesService = module.get<EventPricesService>(EventPricesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const dto: CreateEventDto = {
        title: 'Test Event',
        shortDescription: 'Short Description',
        longDescription: 'Long Description',
        basePrice: 10.0,
        quantityAvailable: 100,
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        categoryType: CategoryEventTypeEnum.BOXING
      };
      await controller.create(dto);
      expect(eventsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllFiltered', () => {
    it('should return all filtered events', async () => {
      const paginationFilterDto: PaginationAndFilterDto = {
        limit: 10,
        offset: 0,
        sortBy: 'title',
        sortOrder: SortOrder.ASC,
        filterBy: 'categoryType',
        filterValue: 'CATEGORY_TYPE'
      };
      await controller.findAllFiltered(paginationFilterDto);
      expect(eventsService.findAllFiltered).toHaveBeenCalledWith(paginationFilterDto);
    });
  });

  describe('findAll', () => {
    it('should return all event values', async () => {
      await controller.findAll();
      expect(eventsService.findAllValues).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one event', async () => {
      const id = '1';
      await controller.findOne(id);
      expect(eventsService.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const id = '1';
      const dto: UpdateEventDto = { title: 'Updated Title' };
      await controller.update(id, dto);
      expect(eventsService.update).toHaveBeenCalledWith(+id, dto);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const id = '1';
      await controller.remove(id);
      expect(eventsService.remove).toHaveBeenCalledWith(+id);
    });
  });
});
