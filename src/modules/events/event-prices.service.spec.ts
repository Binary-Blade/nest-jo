import { Test, TestingModule } from '@nestjs/testing';
import { EventPricesService } from './event-prices.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventPrice } from './entities/event-price.entity';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { PRICES_FORMULA } from '@common/constants';

describe('EventPricesService', () => {
  let service: EventPricesService;
  let eventPriceRepository: Repository<EventPrice>;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventPricesService,
        {
          provide: getRepositoryToken(EventPrice),
          useClass: Repository
        },
        {
          provide: getRepositoryToken(Event),
          useClass: Repository
        }
      ]
    }).compile();

    service = module.get<EventPricesService>(EventPricesService);
    eventPriceRepository = module.get<Repository<EventPrice>>(getRepositoryToken(EventPrice));
    eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('createEventPrices', () => {
    it('should create event prices successfully', async () => {
      const eventId = 1;
      const basePrice = 100;
      const event = { eventId } as Event;

      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(event);
      jest.spyOn(eventPriceRepository, 'create').mockImplementation(dto => dto as EventPrice);
      jest.spyOn(eventPriceRepository, 'save').mockResolvedValue({} as EventPrice);

      await service.createEventPrices(eventId, basePrice);

      PRICES_FORMULA.forEach(formula => {
        expect(eventPriceRepository.create).toHaveBeenCalledWith({
          event: { eventId },
          priceFormula: formula.type,
          price: Math.round(basePrice * formula.multiplier)
        });
        expect(eventPriceRepository.save).toHaveBeenCalled();
      });
    });

    it('should throw NotFoundException if the event does not exist', async () => {
      jest.spyOn(eventRepository, 'findOneBy').mockResolvedValue(null);
      await expect(service.createEventPrices(1, 100)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPriceByEventAndType', () => {
    it('should return the price for a given event and type', async () => {
      const eventId = 1;
      const priceFormula = PriceFormulaEnum.SOLO;
      const price = { price: 100 } as EventPrice;

      jest.spyOn(eventPriceRepository, 'findOne').mockResolvedValue(price);

      const result = await service.getPriceByEventAndType(eventId, priceFormula);
      expect(result).toBe(100);
      expect(eventPriceRepository.findOne).toHaveBeenCalledWith({
        where: {
          event: { eventId },
          priceFormula
        }
      });
    });

    it('should throw NotFoundException if the price does not exist', async () => {
      jest.spyOn(eventPriceRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getPriceByEventAndType(1, PriceFormulaEnum.SOLO)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateEventPrices', () => {
    it('should update event prices successfully', async () => {
      const eventId = 1;
      const newBasePrice = 200;
      const priceRecord = {
        eventPriceId: 1,
        price: 100,
        priceFormula: PriceFormulaEnum.SOLO
      } as EventPrice;

      jest.spyOn(eventPriceRepository, 'findOne').mockResolvedValue(priceRecord);
      jest.spyOn(eventPriceRepository, 'save').mockResolvedValue(priceRecord);

      await service.updateEventPrices(eventId, newBasePrice);

      PRICES_FORMULA.forEach(formula => {
        expect(eventPriceRepository.findOne).toHaveBeenCalledWith({
          where: {
            event: { eventId },
            priceFormula: formula.type
          }
        });
        if (formula.type === priceRecord.priceFormula) {
          expect(eventPriceRepository.save).toHaveBeenCalledWith(priceRecord);
        }
      });
    });
  });

  describe('deleteEventPrices', () => {
    it('should delete event prices successfully', async () => {
      const eventId = 1;
      const prices = [{ eventPriceId: 1 } as EventPrice];

      jest.spyOn(eventPriceRepository, 'find').mockResolvedValue(prices);
      jest.spyOn(eventPriceRepository, 'remove').mockResolvedValue(prices[0]);

      await service.deleteEventPrices(eventId);
      expect(eventPriceRepository.find).toHaveBeenCalledWith({
        where: { event: { eventId } }
      });
      expect(eventPriceRepository.remove).toHaveBeenCalledWith(prices[0]);
    });
  });
});
