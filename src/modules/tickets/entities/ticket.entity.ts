import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId: number;

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
