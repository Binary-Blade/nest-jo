import { statusReservation } from '@common/enums/status-reservation.enum';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { User } from '@modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  reservationId: number;

  @Column({ type: 'varchar', default: statusReservation.PENDING, name: 'type_offer' })
  status: statusReservation;

  @ManyToOne(() => User, user => user.reservations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => CartItem, cartItem => cartItem.reservations)
  @JoinColumn({ name: 'cart_item_id' })
  cartItem: CartItem;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
