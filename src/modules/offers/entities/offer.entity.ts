import { TypeOffer } from '@common/enums/type-offer.enum';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('increment')
  offerId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'varchar', default: TypeOffer.SOLO, name: 'type_offer' })
  type: TypeOffer;

  @Column('decimal')
  price: number;

  @Column({ type: 'int', default: 0 })
  quantityAvailable: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
