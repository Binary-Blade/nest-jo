import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { EventPrice } from './event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';

/**
 * Entity representing an event.
 *
 * @class
 * @entity
 */
@Entity('events')
export class Event {
  /**
   * Unique identifier for the event.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn('increment')
  eventId: number;

  /**
   * Title of the event.
   * @type {string}
   * @column
   * @index
   * @unique
   *
   * @example
   * const eventTitle = event.title;
   */
  @Index()
  @Column({ unique: true, type: 'varchar' })
  title: string;

  /**
   * Short description of the event.
   * @type {string}
   * @column
   *
   * @example
   * const shortDesc = event.shortDescription;
   */
  @Column('text')
  shortDescription: string;

  /**
   * Long description of the event.
   * @type {string}
   * @column
   *
   * @example
   * const longDesc = event.longDescription;
   */
  @Column('text')
  longDescription: string;

  /**
   * Category type of the event.
   * @type {CategoryEventTypeEnum}
   * @column
   *
   * @example
   * const category = event.categoryType;
   */
  @Column()
  categoryType: CategoryEventTypeEnum;

  /**
   * Base price of the event.
   * @type {number}
   * @column
   *
   * @example
   * const basePrice = event.basePrice;
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  /**
   * Start date of the event.
   * @type {Date}
   * @column
   *
   * @example
   * const startDate = event.startDate;
   */
  @Column('date')
  startDate: Date;

  /**
   * End date of the event.
   * @type {Date}
   * @column
   *
   * @example
   * const endDate = event.endDate;
   */
  @Column('date')
  endDate: Date;

  /**
   * Quantity available for the event.
   * @type {number}
   * @column
   * @default 1
   *
   * @example
   * const availableQty = event.quantityAvailable;
   */
  @Column({ type: 'int', default: 1 })
  quantityAvailable: number;

  /**
   * Quantity sold for the event.
   * @type {number}
   * @column
   * @default 0
   *
   * @example
   * const soldQty = event.quantitySold;
   */
  @Column({ type: 'int', default: 0 })
  quantitySold: number;

  /**
   * Revenue generated from the event.
   * @type {number}
   * @column
   * @default 0
   *
   * @example
   * const revenue = event.revenueGenerated;
   */
  @Column({ type: 'int', default: 0 })
  revenueGenerated: number;

  /**
   * Prices associated with the event.
   * @type {EventPrice[]}
   * @oneToMany
   * @eager
   *
   * @example
   * const prices = event.prices;
   */
  @OneToMany(() => EventPrice, price => price.event, { eager: true })
  prices: EventPrice[];

  /**
   * Reservation details associated with the event.
   * @type {ReservationDetails[]}
   * @oneToMany
   *
   * @example
   * const reservationDetails = event.reservationsDetails;
   */
  @OneToMany(() => ReservationDetails, reservationDetails => reservationDetails.event)
  reservationsDetails: ReservationDetails[];

  /**
   * Cart items associated with the event.
   * @type {CartItem[]}
   * @oneToMany
   *
   * @example
   * const cartItems = event.cartItems;
   */
  @OneToMany(() => CartItem, cartItem => cartItem.event)
  cartItems: CartItem[];

  /**
   * Timestamp when the event was created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = event.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the event was last updated.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const updatedAt = event.updatedAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
