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

/**
 * Entity for the reservation_details table.
 *
 * @property reservationDetailsId - The ID of the reservation details
 * @property reservation - The reservation associated with the details
 * @property event - The event associated with the details
 * @property priceFormula - The price formula for the reservation
 * @property title - The title of the reservation
 * @property price - The price of the reservation
 * @property description - The description of the reservation
 * @property createdAt - The creation date of the reservation
 * @property updatedAt - The last update date of the reservation
 */
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
