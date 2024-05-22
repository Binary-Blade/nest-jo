import { Injectable, NotFoundException } from '@nestjs/common';
import { EventPrice } from './entities/event-price.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { PRICES_FORMULA } from '@utils/constants/constants.common';

/**
 * Service to manage event prices.
 * @class
 */
@Injectable()
export class EventPricesService {
  constructor(
    @InjectRepository(EventPrice)
    private readonly eventPriceRepository: Repository<EventPrice>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  /**
   * Creates event prices based on a base price and predefined price formulas.
   *
   * @param {number} eventId - ID of the event.
   * @param {number} basePrice - The base price of the event.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the event is not found.
   *
   * @example
   * await eventPricesService.createEventPrices(1, 100);
   */
  async createEventPrices(eventId: number, basePrice: number): Promise<void> {
    await this.findEventById(eventId);

    for (const formula of PRICES_FORMULA) {
      const price = this.eventPriceRepository.create({
        event: { eventId },
        priceFormula: formula.type,
        price: Math.round(basePrice * formula.multiplier)
      });
      await this.eventPriceRepository.save(price);
    }
  }

  /**
   * Retrieves the price of an event by its ID and price formula.
   *
   * @param {number} eventId - ID of the event.
   * @param {PriceFormulaEnum} priceFormula - The price formula type.
   * @returns {Promise<number>} - The price of the event.
   *
   * @throws {NotFoundException} If the price is not found.
   *
   * @example
   * const price = await eventPricesService.getPriceByEventAndType(1, PriceFormulaEnum.STANDARD);
   */
  async getPriceByEventAndType(eventId: number, priceFormula: PriceFormulaEnum): Promise<number> {
    const price = await this.eventPriceRepository.findOne({
      where: {
        event: { eventId: eventId },
        priceFormula: priceFormula
      }
    });
    if (!price) {
      throw new NotFoundException(
        `Price not found for event ID ${eventId} and type ${priceFormula}`
      );
    }
    return price.price;
  }

  /**
   * Updates the prices of an event based on a new base price and predefined price formulas.
   *
   * @param {number} eventId - ID of the event.
   * @param {number} newBasePrice - The new base price of the event.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the event is not found.
   *
   * @example
   * await eventPricesService.updateEventPrices(1, 150);
   */
  async updateEventPrices(eventId: number, newBasePrice: number): Promise<void> {
    await this.findEventById(eventId);
    const eventPrices = await this.eventPriceRepository.find({
      where: { event: { eventId } }
    });

    const updatedPrices = eventPrices.map(priceRecord => {
      const formula = PRICES_FORMULA.find(f => f.type === priceRecord.priceFormula);
      if (formula) {
        priceRecord.price = Math.round(newBasePrice * formula.multiplier);
      }
      return priceRecord;
    });

    await this.eventPriceRepository.save(updatedPrices);
  }

  /**
   * Deletes all prices of an event.
   *
   * @param {number} eventId - ID of the event.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If the event is not found.
   *
   * @example
   * await eventPricesService.deleteEventPrices(1);
   */
  async deleteEventPrices(eventId: number): Promise<void> {
    await this.findEventById(eventId);
    const prices = await this.eventPriceRepository.find({
      where: { event: { eventId: eventId } }
    });

    for (const price of prices) {
      await this.eventPriceRepository.remove(price);
    }
  }

  /**
   * Finds an event by its ID.
   *
   * @param {number} eventId - ID of the event.
   * @returns {Promise<Event>} - The found event.
   *
   * @throws {NotFoundException} If the event is not found.
   *
   * @private
   *
   * @example
   * const event = await eventPricesService.findEventById(1);
   */
  private async findEventById(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ eventId });
    if (!event) throw new NotFoundException(`Event with ID ${eventId} not found.`);
    return event;
  }
}
