import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { EventsService } from './events.service';

/**
 * Service responsible for handling event sales.
 * This service is used to process the tickets and revenue for a list of cart items.
 */
@Injectable()
export class EventSalesService {
  private readonly deductionMap = {
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
   * Process the tickets and revenue for a list of cart items.
   *
   * @param items - The items to process
   * @throws NotFoundException if there are not enough tickets available
   * @returns - void
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
   * Update the revenue for an event.
   *
   * @private Do not expose this method to the controller
   * @param eventId - The ID of the event
   * @param additionalRevenue - The additional revenue to add
   * @returns - void
   * @throws NotFoundException if the event does not exist
   */
  private async updateRevenue(eventId: number, additionalRevenue: number): Promise<void> {
    const event = await this.eventsService.findEventById(eventId);
    event.revenueGenerated += additionalRevenue;
    await this.eventRepository.save(event);
  }

  /**
   * Deduct the quantity of tickets available for an event.
   *
   * @private  Do not expose this method to the controller
   * @param eventId - The ID of the event
   * @param priceFormula - The price formula for the event
   * @param quantity - The quantity to deduct
   * @returns - void
   * @throws NotFoundException if there are not enough tickets available
   * @throws NotFoundException if the event does not exist
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
   * Get the quantity to deduct for a given price formula.
   *
   * @private Do not expose this method to the controller
   * @param priceFormula - The price formula
   * @returns - The quantity to deduct
   */
  private quantityPerFormula(priceFormula: string): number {
    return this.deductionMap[priceFormula] || 1;
  }
}
