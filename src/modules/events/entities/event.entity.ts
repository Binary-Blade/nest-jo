import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { EventPrice } from '@modules/event-prices/entities/event-price.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @Column('int')
  basePrice: number;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column({ type: 'int', default: 1 })
  quantityAvailable: number;

  @OneToMany(() => EventPrice, price => price.event, { eager: true })
  prices: EventPrice[];

  @OneToMany(() => CartItem, cartItem => cartItem.event)
  cartItems: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
