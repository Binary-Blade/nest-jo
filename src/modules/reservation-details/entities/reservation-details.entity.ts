import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { Event } from '@modules/events/entities/event.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index
} from 'typeorm';

@Entity('reservation_details')
export class ReservationDetails {
  @PrimaryGeneratedColumn('increment')
  reservationDetailsId: number;

  @Index()
  @OneToOne(() => Reservation, reservation => reservation.reservationDetails)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @ManyToOne(() => Event, event => event.reservationsDetails, { nullable: false })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ type: 'enum', enum: PriceFormulaEnum })
  priceFormula: PriceFormulaEnum;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
