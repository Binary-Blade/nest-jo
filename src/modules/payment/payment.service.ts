import { Injectable } from '@nestjs/common';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { ReservationsService } from '@modules/reservations/reservations.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly cartItemsService: CartItemsService,
    private readonly reservationsService: ReservationsService
  ) {}

  async processPayment(
    userId: number,
    cartId: number
  ): Promise<{ status: string; detail: string }> {
    console.log('Processing payment for userId:', userId);

    const isPaymentSuccessful = Math.random() > 0.2; //  80% success rate
    if (!isPaymentSuccessful) {
      return {
        status: 'failure',
        detail: 'Payment failed, please try again later.'
      };
    }

    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
    const paymentId = Math.floor(Math.random() * 1000); //  Random payment ID

    try {
      await this.reservationsService.createReservations(userId, paymentId, cartItems);
      return {
        status: 'success',
        detail: 'Payment successful, reservations created'
      };
    } catch (error) {
      console.error('Error during reservation creation:', error);
      return {
        status: 'failure',
        // payment failed
        detail: 'Error during reservation creation, please try again later.'
      };
    }
  }
}
