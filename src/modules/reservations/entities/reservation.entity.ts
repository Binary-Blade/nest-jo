import { PrimaryGeneratedColumn } from 'typeorm';

export class Reservation {
  @PrimaryGeneratedColumn('increment')
  reservationId: number;
}
