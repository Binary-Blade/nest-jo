import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { User } from '@modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
  Index
} from 'typeorm';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('increment')
  cartId: number;

  @Index()
  @OneToOne(() => User, user => user.cart)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => CartItem, cartItem => cartItem.cart)
  cartItem: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
