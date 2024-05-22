import { Injectable } from '@nestjs/common';
import { PaymentResult } from '@common/interfaces/payment.interface';
import { StatusReservation } from '@common/enums/status-reservation.enum';

/**
 * Service to handle payment processing.
 * @class
 */
@Injectable()
export class PaymentService {
  private readonly SUCCESS_RATE = 0.7; // Probability of payment success

  /**
   * Processes a payment based on the total amount in the cart.
   *
   * @param {number} cartTotal - The total amount in the shopping cart.
   * @returns {Promise<PaymentResult>} - The result of the payment processing.
   *
   * @example
   * const paymentResult = await paymentService.processPayment(100);
   */
  async processPayment(cartTotal: number): Promise<PaymentResult> {
    const random = Math.random(); // Generate a random number between 0 and 1

    // If the cart total is zero, reject the payment
    if (cartTotal === 0) {
      return {
        status: StatusReservation.REJECTED,
        detail: 'No items found in the cart to process.'
      };
    }

    // Approve or reject the payment based on the success rate
    if (random < this.SUCCESS_RATE) {
      return {
        status: StatusReservation.APPROVED,
        detail: 'Payment processed successfully.'
      };
    } else {
      return {
        status: StatusReservation.REJECTED,
        detail: 'Payment processing failed.'
      };
    }
  }
}
