import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

@Injectable()
export class EventSalesService {
  private readonly deductionMap = {
    [PriceFormulaEnum.SOLO]: 1,
    [PriceFormulaEnum.DUO]: 2,
    [PriceFormulaEnum.FAMILY]: 4
  };

  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {}

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

  private async updateRevenue(eventId: number, additionalRevenue: number): Promise<void> {
    const event = await this.findEventById(eventId);
    event.revenueGenerated += additionalRevenue;
    await this.eventRepository.save(event);
  }

  private async deductEventQuantity(
    eventId: number,
    priceFormula: string,
    quantity: number
  ): Promise<void> {
    const event = await this.findEventById(eventId);
    const quantityToDeduct = this.quantityPerFormula(priceFormula) * quantity;
    if (quantityToDeduct > event.quantityAvailable) {
      throw new NotFoundException('Not enough tickets available');
    }
    event.quantityAvailable -= quantityToDeduct;
    event.quantitySold += quantityToDeduct;
    await this.eventRepository.save(event);
  }

  private quantityPerFormula(priceFormula: string): number {
    return this.deductionMap[priceFormula] || 1;
  }

  private async findEventById(eventId: number): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ eventId });
    if (!event) throw new NotFoundException(`Event with id ${eventId} not found`);
    return event;
  }
}
