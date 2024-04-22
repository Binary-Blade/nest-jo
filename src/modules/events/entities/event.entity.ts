import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

/**
 * Entity for the events table
 * @param eventId - The ID of the event
 * @param title - The title of the event
 * @param description - The description of the event
 * @param type - The type of the event
 * @param price - The price of the event
 * @param quantityAvailable - The quantity of the event available
 * @param createdAt - The date the event was created
 * @param updatedAt - The date the event was last updated
 * @returns - The created event
 */
@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('increment')
  eventId: number;

  @Column({ unique: true, type: 'varchar' })
  title: string;

  @Column('text')
  description: string;

  @Column('int')
  basePrice: number;

  @Column('int', { nullable: true })
  soloPrice: number;

  @Column('int', { nullable: true })
  duoPrice: number;

  @Column('int', { nullable: true })
  familyPrice: number;

  @Column({ type: 'int', default: 0 })
  quantityAvailable: number;

  @OneToMany(() => CartItem, cartItem => cartItem.event)
  cartItems: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
