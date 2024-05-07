import { Test, TestingModule } from '@nestjs/testing';
import { EventPricesService } from './event-prices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventPrice } from './entities/event-price.entity';
import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { NotFoundException } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { PRICES_FORMULA } from '@common/constants';

describe('EventPricesService', () => {
  let service: EventPricesService;
  let eventPriceRepository: Repository<EventPrice>;
  let eventsService: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventPricesService,
        {
          provide: getRepositoryToken(EventPrice),
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

    service = module.get<EventPricesService>(EventPricesService);
    eventPriceRepository = module.get<Repository<EventPrice>>(getRepositoryToken(EventPrice));
    eventsService = module.get<EventsService>(EventsService);
  });

  describe('createEventPrices', () => {
    it('should create event prices successfully', async () => {
      const event = { eventId: 1 } as Event;
      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventPriceRepository, 'create').mockImplementation((dto: any) => dto);
      jest.spyOn(eventPriceRepository, 'save').mockImplementation(async (entity: any) => entity);

      await service.createEventPrices(1, 100);

      expect(eventsService.findEventById).toHaveBeenCalledWith(1);
      expect(eventPriceRepository.create).toHaveBeenCalledTimes(PRICES_FORMULA.length);
      expect(eventPriceRepository.save).toHaveBeenCalledTimes(PRICES_FORMULA.length);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsService, 'findEventById').mockRejectedValue(new NotFoundException());

      await expect(service.createEventPrices(1, 100)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPriceByEventAndType', () => {
    it('should get the price for an event and type successfully', async () => {
      const eventPrice = { price: 100 } as EventPrice;
      jest.spyOn(eventPriceRepository, 'findOne').mockResolvedValue(eventPrice);

      const result = await service.getPriceByEventAndType(1, PriceFormulaEnum.SOLO);
      expect(result).toBe(100);
      expect(eventPriceRepository.findOne).toHaveBeenCalledWith({
        where: { event: { eventId: 1 }, priceFormula: PriceFormulaEnum.SOLO }
      });
    });

    it('should throw NotFoundException if the price is not found', async () => {
      jest.spyOn(eventPriceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getPriceByEventAndType(1, PriceFormulaEnum.SOLO)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateEventPrices', () => {
    it('should update event prices successfully', async () => {
      const event = { eventId: 1 } as Event;
      const eventPrices = [
        { event: { eventId: 1 }, priceFormula: PriceFormulaEnum.SOLO, price: 100 } as EventPrice
      ];

      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventPriceRepository, 'find').mockResolvedValue(eventPrices);
      jest.spyOn(eventPriceRepository, 'save').mockResolvedValue(eventPrices[0]);

      await service.updateEventPrices(1, 100);

      expect(eventsService.findEventById).toHaveBeenCalledWith(1);
      expect(eventPriceRepository.find).toHaveBeenCalledWith({
        where: { event: { eventId: 1 } }
      });
      expect(eventPriceRepository.save).toHaveBeenCalledWith([
        expect.objectContaining({
          event: { eventId: 1 },
          price: 100
        })
      ]);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsService, 'findEventById').mockRejectedValue(new NotFoundException());

      await expect(service.updateEventPrices(1, 100)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteEventPrices', () => {
    it('should delete event prices successfully', async () => {
      const event = { eventId: 1 } as Event;
      const eventPrices = [
        { event: { eventId: 1 }, priceFormula: PriceFormulaEnum.SOLO } as EventPrice
      ];

      jest.spyOn(eventsService, 'findEventById').mockResolvedValue(event);
      jest.spyOn(eventPriceRepository, 'find').mockResolvedValue(eventPrices);
      jest.spyOn(eventPriceRepository, 'remove').mockResolvedValue(eventPrices[0]);

      await service.deleteEventPrices(1);

      expect(eventsService.findEventById).toHaveBeenCalledWith(1);
      expect(eventPriceRepository.find).toHaveBeenCalledWith({
        where: { event: { eventId: 1 } }
      });
      expect(eventPriceRepository.remove).toHaveBeenCalledWith(eventPrices[0]);
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventsService, 'findEventById').mockRejectedValue(new NotFoundException());

      await expect(service.deleteEventPrices(1)).rejects.toThrow(NotFoundException);
    });
  });
});
