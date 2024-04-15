import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm';
import { Reservation } from './reservation.entity'; // Assurez-vous que le chemin d'accès à cette entité est correct

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
