import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { EventPrice } from './event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';

/**
 * Entity for the events table.
 *
 * @property eventId - The ID of the event
 * @property title - The title of the event
 * @property description - The description of the event
 * @property categoryType - The category type of the event
 * @property basePrice - The base price of the event
 * @property startDate - The start date of the event
 * @property endDate - The end date of the event
 * @property quantityAvailable - The quantity of tickets available
 * @property quantitySold - The quantity of tickets sold
 * @property revenueGenerated - The revenue generated from the event
 * @property prices - The prices for the event
 * @property reservationsDetails - The reservation details for the event
 * @property cartItems - The cart items for the event
 * @property createdAt - The creation date of the event
 * @property updatedAt - The last update date of the event
 */
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('increment')
  eventId: number;

  @Index()
  @Column({ unique: true, type: 'varchar' })
  title: string;

  @Column('text')
  description: string;

  @Column()
  categoryType: CategoryEventTypeEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column({ type: 'int', default: 1 })
  quantityAvailable: number;

  @Column({ type: 'int', default: 0 })
  quantitySold: number;

  @Column({ type: 'int', default: 0 })
  revenueGenerated: number;

  @OneToMany(() => EventPrice, price => price.event, { eager: true })
  prices: EventPrice[];

  @OneToMany(() => ReservationDetails, reservationDetails => reservationDetails.event)
  reservationsDetails: ReservationDetails[];

  @OneToMany(() => CartItem, cartItem => cartItem.event)
  cartItems: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
