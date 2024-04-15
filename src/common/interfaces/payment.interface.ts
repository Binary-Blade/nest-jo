import { Reservation } from '@modules/reservations/entities/reservation.entity';

export interface PaymentResult {
  status: 'success' | 'pending' | 'failure';
  detail: string;
}

export interface ProcessPaymentResponse {
  status: string;
  detail: string;
  reservations?: Reservation[];
}
