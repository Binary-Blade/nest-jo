import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index
} from 'typeorm';

/**
 * Entity representing a reservation.
 *
 * @class
 * @entity
 */
@Entity('reservations')
export class Reservation {
  /**
   * Unique identifier for the reservation.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn('increment')
  reservationId: number;

  /**
   * User associated with the reservation.
   * @type {User}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const user = reservation.user;
   */
  @Index()
  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Detailed information of the reservation.
   * @type {ReservationDetails}
   * @oneToOne
   * @joinColumn
   *
   * @example
   * const details = reservation.reservationDetails;
   */
  @OneToOne(() => ReservationDetails, reservationDetails => reservationDetails.reservation)
  @JoinColumn({ name: 'reservationDetailsId' })
  reservationDetails: ReservationDetails;

  /**
   * Transaction associated with the reservation.
   * @type {Transaction}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const transaction = reservation.transaction;
   */
  @Index()
  @ManyToOne(() => Transaction, transaction => transaction.reservation)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  /**
   * Cart item associated with the reservation.
   * @type {CartItem}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const cartItem = reservation.cartItem;
   */
  @Index()
  @ManyToOne(() => CartItem, cartItem => cartItem.reservations)
  @JoinColumn({ name: 'cartItemId' })
  cartItem: CartItem;

  /**
   * Ticket associated with the reservation.
   * @type {Ticket}
   * @oneToOne
   * @joinColumn
   *
   * @example
   * const ticket = reservation.ticket;
   */
  @OneToOne(() => Ticket, ticket => ticket.reservation)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  /**
   * Timestamp when the reservation was created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = reservation.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the reservation was last updated.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const updatedAt = reservation.updatedAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
