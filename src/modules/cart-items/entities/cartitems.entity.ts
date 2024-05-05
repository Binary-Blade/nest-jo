import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Cart } from '@modules/carts/entities/cart.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Event } from '@modules/events/entities/event.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  cartItemId: number;

  @ManyToOne(() => Cart, cart => cart.cartId)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Event, event => event.cartItems)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @OneToMany(() => Reservation, reservation => reservation.cartItem)
  reservations: Reservation[];

  @Column()
  priceFormula: PriceFormulaEnum;

  @Column('int')
  price: number;

  @Column('int')
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
