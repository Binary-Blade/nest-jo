import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { EventsService } from './events.service';

/**
 * Service to manage event sales and revenue.
 * @class
 */
@Injectable()
export class EventSalesService {
  /**
   * Map of price formulas to quantity deduction factors.
   *
   * @private
   * @readonly
   * @type {Record<string, number>}
   * @memberof EventSalesService
   */
  private readonly deductionMap: Record<string, number> = {
    [PriceFormulaEnum.SOLO]: 1,
    [PriceFormulaEnum.DUO]: 2,
    [PriceFormulaEnum.FAMILY]: 4
  };

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly eventsService: EventsService
  ) {}

  /**
   * Processes event tickets and updates revenue based on cart items.
   *
   * @param {CartItem[]} items - List of cart items to process.
   * @returns {Promise<void>}
   *
   * @example
   * await eventSalesService.processEventTicketsAndRevenue(cartItems);
   */
  async processEventTicketsAndRevenue(items: CartItem[]): Promise<void> {
    let totalNewRevenue = 0;
    for (const item of items) {
      await this.deductEventQuantity(item.event.eventId, item.priceFormula, item.quantity);
      totalNewRevenue += item.price * item.quantity;
    }
    if (items.length > 0) {
      await this.updateRevenue(items[0].event.eventId, totalNewRevenue);
    }
  }

  /**
   * Updates the revenue for a specific event.
   *
   * @param {number} eventId - ID of the event.
   * @param {number} additionalRevenue - The additional revenue to add.
   * @returns {Promise<void>}
   *
   * @private
   *
   * @example
   * await eventSalesService.updateRevenue(1, 500);
   */
  private async updateRevenue(eventId: number, additionalRevenue: number): Promise<void> {
    const event = await this.eventsService.findEventById(eventId);
    event.revenueGenerated += additionalRevenue;
    await this.eventRepository.save(event);
  }

  /**
   * Deducts the quantity of tickets available for a specific event.
   *
   * @param {number} eventId - ID of the event.
   * @param {string} priceFormula - The price formula used.
   * @param {number} quantity - The quantity of tickets to deduct.
   * @returns {Promise<void>}
   *
   * @throws {NotFoundException} If not enough tickets are available.
   *
   * @private
   *
   * @example
   * await eventSalesService.deductEventQuantity(1, PriceFormulaEnum.SOLO, 3);
   */
  private async deductEventQuantity(
    eventId: number,
    priceFormula: string,
    quantity: number
  ): Promise<void> {
    const event = await this.eventsService.findEventById(eventId);
    const quantityToDeduct = this.quantityPerFormula(priceFormula) * quantity;
    if (quantityToDeduct > event.quantityAvailable) {
      throw new NotFoundException('Not enough tickets available');
    }
    event.quantityAvailable -= quantityToDeduct;
    event.quantitySold += quantityToDeduct;
    await this.eventRepository.save(event);
  }

  /**
   * Gets the quantity deduction factor for a given price formula.
   *
   * @param {string} priceFormula - The price formula.
   * @returns {number} - The quantity deduction factor.
   *
   * @private
   *
   * @example
   * const deductionFactor = eventSalesService.quantityPerFormula(PriceFormulaEnum.SOLO);
   */
  private quantityPerFormula(priceFormula: string): number {
    return this.deductionMap[priceFormula] || 1;
  }
}
