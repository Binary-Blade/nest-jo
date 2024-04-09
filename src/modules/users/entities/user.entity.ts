import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '@common/enums/user-role.enum';
import { Cart } from '@modules/carts/entities/cart.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: false, name: 'passwordHash' })
  password: string;

  @Exclude()
  @Column({ unique: true })
  accountKey: string;

  @Exclude()
  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole;

  @Exclude()
  @Column({ type: 'int', default: 1 })
  tokenVersion: number;

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastLogin: Date;
}
