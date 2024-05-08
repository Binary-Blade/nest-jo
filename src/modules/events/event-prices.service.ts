import { Injectable, NotFoundException } from '@nestjs/common';
import { EventPrice } from './entities/event-price.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { PRICES_FORMULA } from '@common/constants';

/**
 * Service responsible for managing event prices.
 * This service is used to create, update, and delete prices for an event.
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
   * Create event prices based on a base price.
   *
   * @param eventId - The ID of the event to create prices for
   * @param basePrice - The base price to use for the prices
   * @throws NotFoundException if the event does not exist
   * @returns - void
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
   * Get the price for an event based on the price formula.
   *
   * @param eventId - The ID of the event to get the price for
   * @param priceFormula - The price formula to use
   * @returns - The price for the event
   * @throws NotFoundException if the price is not found
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
   * Update the prices for an event based on a new base price.
   *
   * @param eventId - The ID of the event to update prices for
   * @param newBasePrice - The new base price to use for the prices
   * @returns - void
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
   * Delete all prices for an event.
   *
   * @param eventId - The ID of the event to delete prices for
   * @returns - void
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
   * Find an event by ID
   *
   * @param eventId - The ID of the event to find
   * @returns - The event
   * @throws NotFoundException if the event does not exist
   */
  private async findEventById(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ eventId });
    if (!event) throw new NotFoundException(`Event with ID ${eventId} not found.`);
    return event;
  }
}
