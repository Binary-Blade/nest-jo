import { StatusReservation } from '@common/enums/status-reservation.enum';
import { Reservation } from '@modules/reservations/entities/reservation.entity';

/**
 * Interface for the payment service.
 *
 * @property status - The status of the payment.
 * @property detail - The detail of the payment.
 */
export interface PaymentResult {
  status: StatusReservation;
  detail: string;
}

/**
 * Interface for the payment service.
 *
 * @property status - The status of the payment.
 * @property detail - The detail of the payment.
 * @property reservations - The reservations.
 */
export interface ProcessPaymentResponse {
  status: StatusReservation;
  detail: string;
  reservations?: Reservation[];
}
