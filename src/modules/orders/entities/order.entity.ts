import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { Event } from '@modules/events/entities/event.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('increment')
  orderId: number;

  @OneToOne(() => Reservation, reservation => reservation.order)
  @JoinColumn({ name: 'reservationId' })
  reservation: Reservation;

  @ManyToOne(() => Event, event => event.orders)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ type: 'varchar', default: StatusReservation.PENDING })
  statusPayment: StatusReservation;

  @Column()
  priceFormula: PriceFormulaEnum;

  @Column()
  paymentId: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
