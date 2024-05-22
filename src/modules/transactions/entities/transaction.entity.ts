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

/**
 * Entity representing a transaction.
 *
 * @class
 * @entity
 */
@Entity('transactions')
export class Transaction {
  /**
   * Unique identifier for the transaction.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn('increment')
  transactionId: number;

  /**
   * User associated with the transaction.
   * @type {User}
   * @manyToOne
   * @joinColumn
   *
   * @example
   * const user = transaction.user;
   */
  @Index()
  @ManyToOne(() => User, user => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Reservations associated with the transaction.
   * @type {Reservation[]}
   * @oneToMany
   *
   * @example
   * const reservations = transaction.reservations;
   */
  @OneToMany(() => Reservation, reservation => reservation.transaction)
  reservation: Reservation[];

  /**
   * Status of the payment for the transaction.
   * @type {StatusReservation}
   * @column
   *
   * @example
   * const statusPayment = transaction.statusPayment;
   */
  @Column({ type: 'varchar' })
  statusPayment: StatusReservation;

  /**
   * Payment identifier for the transaction.
   * @type {number}
   * @column
   *
   * @example
   * const paymentId = transaction.paymentId;
   */
  @Column()
  paymentId: number;

  /**
   * Total amount of the transaction.
   * @type {number}
   * @column
   *
   * @example
   * const totalAmount = transaction.totalAmount;
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  /**
   * Timestamp when the transaction was created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = transaction.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the transaction was last updated.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const updatedAt = transaction.updatedAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
