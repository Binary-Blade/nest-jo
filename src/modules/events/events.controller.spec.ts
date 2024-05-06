import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventPricesService } from './event-prices.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { UserRole } from '@common/enums/user-role.enum';
import { RoleGuard } from '@security/guards';
import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { Context } from 'vm';

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
            findAll: jest.fn(),
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
    })
      .overrideGuard(RoleGuard)
      .useValue({
        canActivate: (context: Context) => {
          const request = context.switchToHttp().getRequest();
          const user = request.user;
          return user && user.role === UserRole.ADMIN;
        }
      })
      .compile();

    controller = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);
    eventPricesService = module.get<EventPricesService>(EventPricesService);
  });

  describe('create', () => {
    it('should create an event successfully', async () => {
      const createEventDto: CreateEventDto = {
        title: 'Test Event',
        description: 'A test event',
        categoryType: CategoryEventTypeEnum.TENNIS,
        basePrice: 100,
        startDate: '2024-01-01',
        endDate: '2024-01-02',
        quantityAvailable: 100
      };
      const event = {} as Event;

      jest.spyOn(eventsService, 'create').mockResolvedValue(event);

      const result = await controller.create(createEventDto);
      expect(result).toBe(event);
      expect(eventsService.create).toHaveBeenCalledWith(createEventDto);
    });

    it('should throw ConflictException if an event with the same title already exists', async () => {
      jest.spyOn(eventsService, 'create').mockRejectedValue(new ConflictException());

      await expect(
        controller.create({ title: 'Duplicate Event' } as CreateEventDto)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all events successfully', async () => {
      const events = [{} as Event];
      jest.spyOn(eventsService, 'findAll').mockResolvedValue(events);

      const result = await controller.findAll();
      expect(result).toBe(events);
      expect(eventsService.findAll).toHaveBeenCalled();
    });
  });

  describe('getTicketPrice', () => {
    it('should return the ticket price successfully', async () => {
      jest.spyOn(eventPricesService, 'getPriceByEventAndType').mockResolvedValue(100);

      const result = await controller.getTicketPrice(1, PriceFormulaEnum.SOLO);
      expect(result).toEqual({ eventId: 1, priceFormula: PriceFormulaEnum.SOLO, price: 100 });
      expect(eventPricesService.getPriceByEventAndType).toHaveBeenCalledWith(
        1,
        PriceFormulaEnum.SOLO
      );
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest
        .spyOn(eventPricesService, 'getPriceByEventAndType')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getTicketPrice(1, PriceFormulaEnum.SOLO)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findOne', () => {
    it('should return a single event successfully', async () => {
      const event = {} as Event;
      jest.spyOn(eventsService, 'findOne').mockResolvedValue(event);

      const result = await controller.findOne('1');
      expect(result).toBe(event);
      expect(eventsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsService, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an event successfully', async () => {
      const updateEventDto: UpdateEventDto = { basePrice: 200 };
      const event = {} as Event;

      jest.spyOn(eventsService, 'update').mockResolvedValue(event);

      const result = await controller.update('1', updateEventDto);
      expect(result).toBe(event);
      expect(eventsService.update).toHaveBeenCalledWith(1, updateEventDto);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsService, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', { basePrice: 200 } as UpdateEventDto)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ConflictException if an event with the same title already exists', async () => {
      jest.spyOn(eventsService, 'update').mockRejectedValue(new ConflictException());

      await expect(
        controller.update('1', { title: 'Duplicate Event' } as UpdateEventDto)
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove an event successfully', async () => {
      jest.spyOn(eventsService, 'remove').mockResolvedValue('Event deleted successfully.');

      const result = await controller.remove('1');
      expect(result).toBe('Event deleted successfully.');
      expect(eventsService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsService, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
