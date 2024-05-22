import { StatusReservation } from '@common/enums/status-reservation.enum';
import { Reservation } from '@modules/reservations/entities/reservation.entity';

/**
 * Interface representing the result of a payment.
 *
 * @interface PaymentResult
 */
export interface PaymentResult {
  /**
   * Status of the payment.
   * @type {StatusReservation}
   *
   * @example
   * const paymentResult: PaymentResult = { status: StatusReservation.PAID, detail: 'Payment successful', paymentId: 12345 };
   */
  status: StatusReservation;

  /**
   * Detailed message about the payment result.
   * @type {string}
   *
   * @example
   * const paymentResult: PaymentResult = { status: StatusReservation.FAILED, detail: 'Insufficient funds' };
   */
  detail: string;

  /**
   * Identifier for the payment (optional).
   * @type {number}
   *
   * @example
   * const paymentResult: PaymentResult = { status: StatusReservation.PAID, detail: 'Payment successful', paymentId: 12345 };
   */
  paymentId?: number;
}

/**
 * Interface representing the response after processing a payment.
 *
 * @interface ProcessPaymentResponse
 */
export interface ProcessPaymentResponse {
  /**
   * Status of the payment process.
   * @type {StatusReservation}
   *
   * @example
   * const paymentResponse: ProcessPaymentResponse = { status: StatusReservation.PAID, detail: 'Payment and reservation successful', reservations: [] };
   */
  status: StatusReservation;

  /**
   * Detailed message about the payment process result.
   * @type {string}
   *
   * @example
   * const paymentResponse: ProcessPaymentResponse = { status: StatusReservation.FAILED, detail: 'Payment failed, no reservations made' };
   */
  detail: string;

  /**
   * List of reservations associated with the payment (optional).
   * @type {Reservation[]}
   *
   * @example
   * const paymentResponse: ProcessPaymentResponse = { status: StatusReservation.PAID, detail: 'Payment and reservation successful', reservations: [reservation1, reservation2] };
   */
  reservations?: Reservation[];
}
