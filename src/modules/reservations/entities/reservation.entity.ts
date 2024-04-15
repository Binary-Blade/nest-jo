import { statusReservation } from '@common/enums/status-reservation.enum';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { User } from '@modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  reservationId: number;

  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => CartItem, cartItem => cartItem.reservations)
  @JoinColumn({ name: 'cartItemId' })
  cartItem: CartItem;

  @OneToOne(() => Ticket, ticket => ticket.reservation)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @Column({ type: 'int', nullable: true })
  ticketId?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'int' })
  paymentId: number;

  @Column({ type: 'varchar', default: statusReservation.PENDING })
  status: statusReservation;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
