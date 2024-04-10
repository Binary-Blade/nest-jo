import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Offer } from '@modules/offers/entities/offer.entity';
import { Cart } from '@modules/carts/entities/cart.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  cartItemsId: number;

  @ManyToOne(() => Cart, cart => cart.cartId)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Offer, offer => offer.cartItems)
  @JoinColumn({ name: 'offerId' })
  offer: Offer;

  @Column('int')
  quantity: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
