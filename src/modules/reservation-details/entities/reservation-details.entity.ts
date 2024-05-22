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
 * Entity representing the details of a reservation.
 *
 * @class
 * @entity
 */
@Entity('reservation_details')
export class ReservationDetails {
  /**
   * Unique identifier for the reservation details.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn('increment')
  reservationDetailsId: number;

  /**
   * Reservation associated with the reservation details.
   * @type {Reservation}
   * @oneToOne
   * @joinColumn
   *
   * @example
   * const reservation = reservationDetails.reservation;
   */
  @Index()
  @OneToOne(() => Reservation, reservation => reservation.reservationDetails)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  /**
   * Event associated with the reservation details.
   * @type {Event}
   * @manyToOne
   * @joinColumn
   * @nullable false
   *
   * @example
   * const event = reservationDetails.event;
   */
  @ManyToOne(() => Event, event => event.reservationsDetails, { nullable: false })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  /**
   * Pricing formula for the reservation.
   * @type {PriceFormulaEnum}
   * @column
   *
   * @example
   * const priceFormula = reservationDetails.priceFormula;
   */
  @Column({ type: 'enum', enum: PriceFormulaEnum })
  priceFormula: PriceFormulaEnum;

  /**
   * Title of the reservation details.
   * @type {string}
   * @column
   *
   * @example
   * const title = reservationDetails.title;
   */
  @Column()
  title: string;

  /**
   * Price of the reservation.
   * @type {number}
   * @column
   * @precision 10
   * @scale 2
   *
   * @example
   * const price = reservationDetails.price;
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  /**
   * Short description of the reservation details.
   * @type {string}
   * @column
   *
   * @example
   * const description = reservationDetails.shortDescription;
   */
  @Column('text')
  shortDescription: string;

  /**
   * Timestamp when the reservation details were created.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const createdAt = reservationDetails.createdAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  /**
   * Timestamp when the reservation details were last updated.
   * @type {Date}
   * @column
   * @default CURRENT_TIMESTAMP
   *
   * @example
   * const updatedAt = reservationDetails.updatedAt;
   */
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
