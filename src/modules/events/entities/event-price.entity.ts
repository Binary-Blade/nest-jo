import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

/**
 * Entity for the event_prices table.
 *
 * @property eventPriceId - The ID of the event price
 * @property event - The event associated with the price
 * @property priceFormula - The price formula for the event
 * @property price - The price for the event
 */
@Entity('event_prices')
export class EventPrice {
  @PrimaryGeneratedColumn('increment')
  eventPriceId: number;

  @Index()
  @ManyToOne(() => Event, event => event.prices)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({
    type: 'enum',
    enum: PriceFormulaEnum,
    name: 'priceFormula'
  })
  priceFormula: PriceFormulaEnum;

  @Column()
  price: number;
}
