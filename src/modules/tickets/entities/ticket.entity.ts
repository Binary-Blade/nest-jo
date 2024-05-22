import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, Index } from 'typeorm';

/**
 * Entity representing a ticket.
 *
 * @class
 * @entity
 */
@Entity('tickets')
export class Ticket {
  /**
   * Unique identifier for the ticket.
   * @type {number}
   * @primaryGeneratedColumn
   */
  @PrimaryGeneratedColumn()
  ticketId: number;

  /**
   * Reservation associated with the ticket.
   * @type {Reservation}
   * @oneToOne
   * @joinColumn
   *
   * @example
   * const reservation = ticket.reservation;
   */
  @Index()
  @OneToOne(() => Reservation, reservation => reservation.ticket)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  /**
   * Unique purchase key for the ticket.
   * @type {string}
   * @column
   *
   * @example
   * const purchaseKey = ticket.purchaseKey;
   */
  @Column({ unique: true })
  purchaseKey: string;

  /**
   * Secure key for the ticket.
   * @type {string}
   * @column
   *
   * @example
   * const secureKey = ticket.secureKey;
   */
  @Column()
  secureKey: string;

  /**
   * QR code for the ticket.
   * @type {string}
   * @column
   *
   * @example
   * const qrCode = ticket.qrCode;
   */
  @Column()
  qrCode: string;
}
