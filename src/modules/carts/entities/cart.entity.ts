import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
  Index
} from 'typeorm';

/**
 * Entity representing a shopping cart.
 *
 * @class
 * @entity
 */
@Entity('cart')
export class Cart {
  /**
   * Unique identifier for the cart.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn('increment')
  cartId: number;

  /**
   * User associated with the cart.
   * @type {User}
   * @oneToOne
   * @joinColumn
   *
   * @example
   * const userCart = cart.user;
   */
  @Index()
  @OneToOne(() => User, user => user.cart)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Items in the cart.
   * @type {CartItem[]}
   * @oneToMany
   *
   * @example
   * const items = cart.cartItem;
   */
  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cartItem: CartItem[];

  /**
   * Timestamp when the cart was created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = cart.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the cart was last updated.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const updatedAt = cart.updatedAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
