import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '@common/enums/user-role.enum';
import { Cart } from '@modules/carts/entities/cart.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Transaction } from '@modules/transactions/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false, name: 'passwordHash' })
  password: string;

  @Column({ unique: true })
  accountKey: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole;

  @Exclude()
  @Column({ type: 'int', default: 1 })
  tokenVersion: number;

  @Column()
  isActive: boolean;

  @Column()
  transactionsCount: number;

  @Column()
  totalSpent: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;
}
