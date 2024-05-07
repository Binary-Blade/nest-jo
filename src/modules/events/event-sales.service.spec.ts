import { Test, TestingModule } from '@nestjs/testing';
import { EventSalesService } from './event-sales.service';
import { Event } from './entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { NotFoundException } from '@nestjs/common';

describe('EventSalesService', () => {
  let service: EventSalesService;
  let eventRepository: Repository<Event>;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventSalesService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository
        },
        {
          provide: EventsService,
          useValue: {
            findEventById: jest.fn()
          }
        }
      ]
    }).compile();

    service = module.get<EventSalesService>(EventSalesService);
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    eventsService = module.get<EventsService>(EventsService);
  });

  describe('processEventTicketsAndRevenue', () => {
    it('should process event tickets and revenue', async () => {
      const items: CartItem[] = [
        {
          event: { eventId: 1, quantityAvailable: 10, quantitySold: 0, revenueGenerated: 0 },
          price: 10,
          priceFormula: PriceFormulaEnum.SOLO,
          quantity: 1
        } as CartItem
      ];

      const event1 = {
        eventId: 1,
        quantityAvailable: 9,
        quantitySold: 1,
        revenueGenerated: 10
      } as Event;

      const event2 = {
        eventId: 1,
        quantityAvailable: 9,
        quantitySold: 1,
        revenueGenerated: 10
      } as Event;

      jest.spyOn(eventsService, 'findEventById').mockResolvedValueOnce(event1);
      jest.spyOn(eventRepository, 'save').mockResolvedValueOnce(event1);
      jest.spyOn(eventsService, 'findEventById').mockResolvedValueOnce(event2);
      jest.spyOn(eventRepository, 'save').mockResolvedValueOnce(event2);

      await service.processEventTicketsAndRevenue(items);

      expect(eventsService.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.save).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          quantityAvailable: 8,
          quantitySold: 2,
          revenueGenerated: 10
        })
      );

      expect(eventRepository.save).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          quantityAvailable: 9,
          quantitySold: 1,
          revenueGenerated: 20
        })
      );
    });

    it('should throw NotFoundException if not enough tickets are available', async () => {
      const items: CartItem[] = [
        {
          event: { eventId: 1, quantityAvailable: 1 },
          price: 10,
          priceFormula: PriceFormulaEnum.SOLO,
          quantity: 2
        } as CartItem
      ];

      const event = { eventId: 1, quantityAvailable: 1 } as Event;

      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);

      await expect(service.processEventTicketsAndRevenue(items)).rejects.toThrow(NotFoundException);
    });
  });
  describe('updateRevenue', () => {
    it('should update the revenue of an event', async () => {
      const event = { eventId: 1, revenueGenerated: 10 } as Event;

      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);

      await service['updateRevenue'](1, 20);
      expect(eventsService.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          revenueGenerated: 30
        })
      );
    });
  });

  describe('deductEventQuantity', () => {
    it('should deduct the quantity of an event', async () => {
      const event = { eventId: 1, quantityAvailable: 10, quantitySold: 0 } as Event;

      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);

      await service['deductEventQuantity'](1, PriceFormulaEnum.SOLO, 2);
      expect(eventsService.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          quantityAvailable: 8,
          quantitySold: 2
        })
      );
    });

    it('should throw NotFoundException if not enough tickets are available', async () => {
      const event = { eventId: 1, quantityAvailable: 1 } as Event;

      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventRepository, 'save').mockResolvedValue(event);

      await expect(service['deductEventQuantity'](1, PriceFormulaEnum.SOLO, 2)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
