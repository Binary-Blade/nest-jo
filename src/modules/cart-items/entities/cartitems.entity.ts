import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index
} from 'typeorm';
import { Cart } from '@modules/carts/entities/cart.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Event } from '@modules/events/entities/event.entity';
import { PriceFormulaEnum } from '@common/enums/price-formula.enum';

/**
 * Entity representing an item in a shopping cart.
 *
 * @class
 * @entity
 */
@Entity('cart_items')
export class CartItem {
  /**
   * Unique identifier for the cart item.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn()
  cartItemId: number;

  /**
   * Cart associated with the cart item.
   * @type {Cart}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const cart = cartItem.cart;
   */
  @Index()
  @ManyToOne(() => Cart, cart => cart.cartId)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  /**
   * Event associated with the cart item.
   * @type {Event}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const event = cartItem.event;
   */
  @ManyToOne(() => Event, event => event.cartItems)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  /**
   * Reservations for the cart item.
   * @type {Reservation[]}
   * @oneToMany
   *
   * @example
   * const reservations = cartItem.reservations;
   */
  @OneToMany(() => Reservation, reservation => reservation.cartItem)
  reservations: Reservation[];

  /**
   * Pricing formula for the cart item.
   * @type {PriceFormulaEnum}
   * @column
   *
   * @example
   * const priceFormula = cartItem.priceFormula;
   */
  @Column()
  priceFormula: PriceFormulaEnum;

  /**
   * Price of the cart item.
   * @type {number}
   * @column
   *
   * @example
   * const price = cartItem.price;
   */
  @Column('int')
  price: number;

  /**
   * Quantity of the cart item.
   * @type {number}
   * @column
   *
   * @example
   * const quantity = cartItem.quantity;
   */
  @Column('int')
  quantity: number;

  /**
   * Timestamp when the cart item was created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = cartItem.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the cart item was last updated.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const updatedAt = cartItem.updatedAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
