import { Injectable } from '@nestjs/common';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { StatusReservation } from '@common/enums/status-reservation.enum';

/**
 * Service responsible for handling payments.
 * This service is used to process payments for reservations.
 */
@Injectable()
export class PaymentService {
  private readonly SUCCESS_RATE = 0.6; // 60% chance of payment being successful
  private readonly PENDING_RATE = 0.2; // 20% chance of payment being pending

  /**
   * Processes a payment for a reservation.
   *
   * @param cartTotal The total amount to be paid.
   * @returns The payment result.
   * @throws Error if the payment fails.
   */
  async processPayment(cartTotal: number): Promise<PaymentResult> {
    const random = Math.random();

    if (cartTotal === 0) {
      return {
        status: StatusReservation.REJECTED,
        detail: 'No items found in the cart to process.'
      };
    }
    if (random < this.SUCCESS_RATE) {
      return {
        status: StatusReservation.APPROVED,
        detail: 'Payment processed successfully.'
      };
    } else if (random < this.PENDING_RATE + this.SUCCESS_RATE) {
      return {
        status: StatusReservation.PENDING,
        detail: 'Payment is pending confirmation.'
      };
    } else {
      return {
        status: StatusReservation.REJECTED,
        detail: 'Payment processing failed.'
      };
    }
  }
}
