import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '@common/enums/user-role.enum';
import { Cart } from '@modules/carts/entities/cart.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Transaction } from '@modules/transactions/entities/transaction.entity';

/**
 * Entity representing a user.
 *
 * @class
 * @entity
 */
@Entity('users')
export class User {
  /**
   * Unique identifier for the user.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn('increment')
  userId: number;

  /**
   * Shopping cart associated with the user.
   * @type {Cart}
   * @oneToOne
   *
   * @example
   * const cart = user.cart;
   */
  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  /**
   * Reservations made by the user.
   * @type {Reservation[]}
   * @oneToMany
   *
   * @example
   * const reservations = user.reservations;
   */
  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];

  /**
   * Transactions made by the user.
   * @type {Transaction[]}
   * @oneToMany
   *
   * @example
   * const transactions = user.transactions;
   */
  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  /**
   * Email address of the user.
   * @type {string}
   * @column
   *
   * @example
   * const email = user.email;
   */
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  /**
   * First name of the user.
   * @type {string}
   * @column
   *
   * @example
   * const firstName = user.firstName;
   */
  @Column({ type: 'varchar' })
  firstName: string;

  /**
   * Last name of the user.
   * @type {string}
   * @column
   *
   * @example
   * const lastName = user.lastName;
   */
  @Column({ type: 'varchar' })
  lastName: string;

  /**
   * Password hash for the user.
   * This field is excluded from responses.
   * @type {string}
   * @exclude
   * @column
   *
   * @example
   * const password = user.password;
   */
  @Exclude()
  @Column({ type: 'varchar', nullable: false, name: 'passwordHash' })
  password: string;

  /**
   * Unique account key for the user.
   * @type {string}
   * @column
   *
   * @example
   * const accountKey = user.accountKey;
   */
  @Column({ unique: true })
  accountKey: string;

  /**
   * Role of the user.
   * @type {UserRole}
   * @column
   * @default UserRole.USER
   *
   * @example
   * const role = user.role;
   */
  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole;

  /**
   * Version of the token for the user.
   * This field is excluded from responses.
   * @type {number}
   * @exclude
   * @column
   * @default 1
   *
   * @example
   * const tokenVersion = user.tokenVersion;
   */
  @Exclude()
  @Column({ type: 'int', default: 1 })
  tokenVersion: number;

  /**
   * Indicates whether the user is active.
   * @type {boolean}
   * @column
   *
   * @example
   * const isActive = user.isActive;
   */
  @Column()
  isActive: boolean;

  /**
   * Number of transactions made by the user.
   * @type {number}
   * @column
   *
   * @example
   * const transactionsCount = user.transactionsCount;
   */
  @Column()
  transactionsCount: number;

  /**
   * Total amount spent by the user.
   * @type {number}
   * @column
   *
   * @example
   * const totalSpent = user.totalSpent;
   */
  @Column()
  totalSpent: number;

  /**
   * Timestamp when the user was created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = user.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the user last logged in.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const lastLogin = user.lastLogin;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;
}
