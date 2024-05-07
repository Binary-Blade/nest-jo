import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { User } from '@modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  reservationId: number;

  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => ReservationDetails, reservationDetails => reservationDetails.reservation)
  @JoinColumn({ name: 'reservationDetailsId' })
  reservationDetails: ReservationDetails;

  @ManyToOne(() => Transaction, transaction => transaction.reservation)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @ManyToOne(() => CartItem, cartItem => cartItem.reservations)
  @JoinColumn({ name: 'cartItemId' })
  cartItem: CartItem;

  @OneToOne(() => Ticket, ticket => ticket.reservation)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
