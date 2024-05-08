import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, Index } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId: number;

  @Index()
  @OneToOne(() => Reservation, reservation => reservation.ticket)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @Column({ unique: true })
  purchaseKey: string;

  @Column()
  secureKey: string;

  @Column()
  qrCode: string;
}
