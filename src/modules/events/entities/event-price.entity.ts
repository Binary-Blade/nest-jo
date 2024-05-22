import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

/**
 * Entity representing a price associated with an event.
 *
 * @class
 * @entity
 */
@Entity('event_prices')
export class EventPrice {
  /**
   * Unique identifier for the event price.
   * @type {number}
   * @primaryGeneratedColumn
   *
   * @example
   * const eventPrice: EventPrice = { eventPriceId: 1, event: eventInstance, priceFormula: PriceFormulaEnum.FIXED, price: 100.00 };
   */
  @PrimaryGeneratedColumn('increment')
  eventPriceId: number;

  /**
   * Event associated with the event price.
   * @type {Event}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const eventPrice: EventPrice = { eventPriceId: 1, event: eventInstance, priceFormula: PriceFormulaEnum.FIXED, price: 100.00 };
   */
  @Index()
  @ManyToOne(() => Event, event => event.prices)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  /**
   * Pricing formula for the event.
   * @type {PriceFormulaEnum}
   * @column
   * @enum {PriceFormulaEnum}
   * @name priceFormula
   *
   * @example
   * const eventPrice: EventPrice = { eventPriceId: 1, event: eventInstance, priceFormula: PriceFormulaEnum.FIXED, price: 100.00 };
   */
  @Column({
    type: 'enum',
    enum: PriceFormulaEnum,
    name: 'priceFormula'
  })
  priceFormula: PriceFormulaEnum;

  /**
   * Price of the event.
   * @type {number}
   * @column
   *
   * @example
   * const eventPrice: EventPrice = { eventPriceId: 1, event: eventInstance, priceFormula: PriceFormulaEnum.FIXED, price: 100.00 };
   */
  @Column()
  price: number;
}
