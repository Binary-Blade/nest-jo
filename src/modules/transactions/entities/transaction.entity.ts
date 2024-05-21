import { StatusReservation } from '@common/enums/status-reservation.enum';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index
} from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('increment')
  transactionId: number;

  @Index()
  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Reservation, reservation => reservation.transaction)
  reservation: Reservation[];

  @Column({ type: 'varchar' })
  statusPayment: StatusReservation;

  @Column()
  paymentId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
