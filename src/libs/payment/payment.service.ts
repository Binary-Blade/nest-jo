import { Injectable } from '@nestjs/common';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PaymentResult, ProcessPaymentResponse } from '@common/interfaces/payment.interface';
import { StatusReservation } from '@common/enums/status-reservation.enum';

@Injectable()
export class PaymentService {
  private readonly SUCCESS_RATE = 0.1; // 40% chance of payment being successful
  private readonly PENDING_RATE = 0.3; // 30% chance of payment being pending

  // TODO: IMPROVE SERVICE BEFORE UNITS TESTS
  constructor(
    private readonly cartItemsService: CartItemsService,
    private readonly reservationsService: ReservationsService
  ) {}

  async processPayment(userId: number, cartId: number): Promise<ProcessPaymentResponse> {
    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
    if (cartItems.length === 0) {
      return { status: 'failure', detail: 'No items found in the cart to process.' };
    }

    const paymentResult = await this.simulatedPayment();

    switch (paymentResult.status) {
      case 'success':
        const reservationResponse = await this.createReservationsWithStatus(
          userId,
          cartItems,
          cartId,
          StatusReservation.APPROVED
        );
        // Assuming reservationResponse.reservations contains the array of Reservation
        if (reservationResponse.status === 'success') {
          await this.reservationsService.issueTicketsForApprovedReservations(
            reservationResponse.reservations
          );
        }
        return reservationResponse;
      case 'pending':
        return this.createReservationsWithStatus(
          userId,
          cartItems,
          cartId,
          StatusReservation.PENDING
        );
      case 'failure':
      default:
        return this.createReservationsWithStatus(
          userId,
          cartItems,
          cartId,
          StatusReservation.REJECTED
        );
    }
  }

  private async createReservationsWithStatus(
    userId: number,
    cartItems: CartItem[],
    cartId: number,
    status: StatusReservation
  ): Promise<ProcessPaymentResponse> {
    try {
      const reservations = await this.reservationsService.createReservations(
        userId,
        cartItems,
        cartId,
        status
      );
      return { status: 'success', detail: 'Reservations successfully created.', reservations };
    } catch (error) {
      console.error('Error during reservation creation:', error);
      return {
        status: 'failure',
        detail: 'Error during reservation creation, please try again later.'
      };
    }
  }

  private async simulatedPayment(): Promise<PaymentResult> {
    const isPaymentSuccessful = Math.random() > this.SUCCESS_RATE;

    if (isPaymentSuccessful) {
      return { status: 'success', detail: 'Payment processed successfully.' };
    } else {
      const isPaymentPending = Math.random() < this.PENDING_RATE;
      if (isPaymentPending) {
        return { status: 'pending', detail: 'Payment is pending confirmation.' };
      }
      return { status: 'failure', detail: 'Payment processing failed.' };
    }
  }
}
