import { Injectable } from '@nestjs/common';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { PaymentDto } from './dto/payment.dto';
import { statusReservation } from '@common/enums/status-reservation.enum';

@Injectable()
export class PaymentService {
  constructor(
    private readonly cartItemsService: CartItemsService,
    private readonly reservationsService: ReservationsService
  ) {}

  async processPayment(paymentDto: PaymentDto): Promise<{ status: string; detail: string }> {
    console.log('Processing payment...', paymentDto);

    // Simulez une vérification de paiement
    const isPaymentSuccessful = Math.random() > 0.2; // Simule un taux de succès

    if (isPaymentSuccessful) {
      // Supposons que tous les items du cart doivent être convertis en réservations
      const cartItems = await this.cartItemsService.findAllItemsInCart(
        paymentDto.userId,
        paymentDto.cartId
      );

      const paymentId = Math.floor(Math.random() * 1000); // Simulez un ID de paiement

      for (const item of cartItems) {
        await this.reservationsService.createReservation({
          userId: paymentDto.userId,
          cartItemsId: item.cartItemsId,
          status: statusReservation.PENDING,
          paymentId: paymentId
        });
      }

      return {
        status: 'success',
        detail: 'Payment processed successfully. Reservations created.'
      };
    } else {
      return {
        status: 'failure',
        detail: 'Payment failed. No reservations created.'
      };
    }
  }
}
