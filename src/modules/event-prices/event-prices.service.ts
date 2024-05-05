import { Injectable, NotFoundException } from '@nestjs/common';
//import { CreateEventPriceDto } from './dto/create-event-price.dto';
//import { UpdateEventPriceDto } from './dto/update-event-price.dto';
import { EventPrice } from './entities/event-price.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { PRICES_FORMULA } from '@common/constants';

@Injectable()
export class EventPricesService {
  constructor(
    @InjectRepository(EventPrice)
    private readonly eventPriceRepository: Repository<EventPrice>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  async createEventPrices(eventId: number, basePrice: number): Promise<void> {
    const event = await this.eventRepository.findOneBy({ eventId });
    if (!event) throw new NotFoundException(`Event with ID ${eventId} not found.`);

    for (const formula of PRICES_FORMULA) {
      const price = this.eventPriceRepository.create({
        event: { eventId },
        priceFormula: formula.type,
        price: Math.round(basePrice * formula.multiplier)
      });
      await this.eventPriceRepository.save(price);
    }
  }

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

  async updateEventPrices(eventId: number, newBasePrice: number): Promise<void> {
    PRICES_FORMULA.forEach(async formula => {
      const priceRecord = await this.eventPriceRepository.findOne({
        where: {
          event: { eventId: eventId },
          priceFormula: formula.type
        }
      });

      if (priceRecord) {
        priceRecord.price = Math.round(newBasePrice * formula.multiplier);
        await this.eventPriceRepository.save(priceRecord);
      }
    });
  }

  async deleteEventPrices(eventId: number): Promise<void> {
    const prices = await this.eventPriceRepository.find({
      where: { event: { eventId: eventId } }
    });

    for (const price of prices) {
      await this.eventPriceRepository.remove(price);
    }
  }

  findAll() {
    return `This action returns all eventPrices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventPrice`;
  }
  //
  // update(id: number, updateEventPriceDto: UpdateEventPriceDto) {
  //   return `This action updates a #${id} eventPrice`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} eventPrice`;
  // }

  // private calculateTotalTicketPrice(createCartItemDto: CreateCartItemDto, event: Event): number {
  //   let ticketPrice = 0;
  //   switch (createCartItemDto.priceFormula) {
  //     case PriceFormulaEnum.SOLO:
  //       ticketPrice = event.soloPrice;
  //       break;
  //     case PriceFormulaEnum.DUO:
  //       ticketPrice = event.duoPrice;
  //       break;
  //     case PriceFormulaEnum.FAMILY:
  //       ticketPrice = event.familyPrice;
  //       break;
  //   }
  //   return ticketPrice * createCartItemDto.quantity;
  // }
  //
  //
  // async getPriceByType(eventId: number, ticketType: string): Promise<number> {
  //   const event = await this.eventRepository.findOneBy({ eventId });
  //   if (!event) {
  //     throw new NotFoundException(`Event with id ${eventId} not found`);
  //   }
  //   switch (ticketType) {
  //     case PriceFormulaEnum.SOLO:
  //       return event.soloPrice;
  //     case PriceFormulaEnum.DUO:
  //       return event.duoPrice;
  //     case PriceFormulaEnum.FAMILY:
  //       return event.familyPrice;
  //     default:
  //       throw new NotFoundException(`Invalid ticket type provided`);
  //   }
  // }
}
