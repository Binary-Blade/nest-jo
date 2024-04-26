import { StatusReservation } from '@common/enums/status-reservation.enum';
import { Reservation } from '@modules/reservations/entities/reservation.entity';

export interface PaymentResult {
  status: StatusReservation;
  detail: string;
}

export interface ProcessPaymentResponse {
  status: StatusReservation;
  detail: string;
  reservations?: Reservation[];
}
