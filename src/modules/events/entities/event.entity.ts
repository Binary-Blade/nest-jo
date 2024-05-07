import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventPrice } from './event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('increment')
  eventId: number;

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
