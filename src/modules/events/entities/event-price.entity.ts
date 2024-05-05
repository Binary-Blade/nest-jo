import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('event_prices')
export class EventPrice {
  @PrimaryGeneratedColumn('increment')
  eventPriceId: number;

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
