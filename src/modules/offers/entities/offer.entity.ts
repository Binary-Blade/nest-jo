import { TypeOffer } from '@common/enums/type-offer.enum';
import { CartItem } from '@modules/cartitems/entities/cartitems.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

/**
 * Entity for the offers table
 * @param offerId - The ID of the offer
 * @param title - The title of the offer
 * @param description - The description of the offer
 * @param type - The type of the offer
 * @param price - The price of the offer
 * @param quantityAvailable - The quantity of the offer available
 * @param createdAt - The date the offer was created
 * @param updatedAt - The date the offer was last updated
 * @returns - The created offer
 */
@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('increment')
  offerId: number;

  @Column({ unique: true, type: 'varchar' })
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', default: TypeOffer.SOLO, name: 'type_offer' })
  type: TypeOffer;

  @Column('decimal')
  price: number;

  @Column({ type: 'int', default: 0 })
  quantityAvailable: number;

  @OneToMany(() => CartItem, cartItem => cartItem.offer)
  cartItems: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
