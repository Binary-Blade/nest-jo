import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { UsersService } from '@modules/users/users.service';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { Reservation } from './entities/reservation.entity';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { TicketsService } from '@modules/tickets/tickets.service';
import { PaymentService } from '@libs/payment/payment.service';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { EventSalesService } from '@modules/events/event-sales.service';

/**
 * Service responsible for handling reservations.
 * This service is used to create, retrieve, and manage reservations.
 */
@Injectable()
export class ReservationsProcessorService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly ticketService: TicketsService,
    private readonly eventSalesService: EventSalesService,
    private readonly transactionService: TransactionsService,
    private readonly usersService: UsersService,
    private readonly cartService: CartsService,
    private readonly cartItemsService: CartItemsService,
    private readonly paymentService: PaymentService,
    private readonly reservationDetailsService: ReservationDetailsService
  ) {}

  /**
   * Process a reservation, transcation, and payment for a user's cart
   *
   * @param userId - The ID of the user making the reservation
   * @param cartId - The ID of the cart to process
   * @returns - A promise that resolves with the reservations created
   */
  async processUserReservation(userId: number, cartId: number): Promise<Reservation[]> {
    const user = await this.usersService.verifyUserOneBy(userId);
    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
    const cartTotalPrice = this.transactionService.calculateCartTotal(cartItems);
    const paymentResult = await this.paymentService.processPayment(cartTotalPrice);

    const transaction = await this.transactionService.createTransaction(
      user,
      cartTotalPrice,
      paymentResult
    );

    let reservations = await this.createReservationsForAllCartItems(cartItems, user, transaction);

    if (paymentResult.status === StatusReservation.APPROVED) {
      await this.finalizeBooking(cartItems, reservations);
    }
    await this.cleanUpAfterPayment(cartId, userId);
    return reservations;
  }

  /**
   * Create reservations for all items in the cart
   *
   * @private - This method is only used internally by the service
   * @param cartItems - The items in the cart to create reservations for
   * @param user - The user making the reservation
   * @param transaction - The transaction associated with the reservation
   * @returns - A promise that resolves with the reservations created
   * @throws Error if a reservation already exists for an item
   */
  private async createReservationsForAllCartItems(
    cartItems: CartItem[],
    user: User,
    transaction: Transaction
  ): Promise<Reservation[]> {
    let reservations = [];

    for (const item of cartItems) {
      reservations.push(...(await this.createReservationsForEachCartItem(item, user, transaction)));
    }
    return reservations;
  }

  /**
   * Create reservations for each item in the cart
   *
   * @private - This method is only used internally by the service
   * @param item - The item in the cart to create reservations for
   * @param user - The user making the reservation
   * @param transaction - The transaction associated with the reservation
   * @returns - A promise that resolves with the reservations created
   * @throws Error if a reservation already exists for the item
   */
  private async createReservationsForEachCartItem(
    item: CartItem,
    user: User,
    transaction: Transaction
  ): Promise<Reservation[]> {
    let reservations = [];
    await this.preventDuplicateReservation(item, user);
    for (let i = 0; i < item.quantity; i++) {
      let reservation = await this.initiateReservation(user, item, transaction);
      const reservationDetail =
        await this.reservationDetailsService.createReservationDetailsFromReservation(
          reservation,
          item
        );
      reservation.reservationDetails = reservationDetail;
      reservation = await this.reservationRepository.save(reservation);
      reservations.push(reservation);
    }
    return reservations;
  }

  /**
   * Initiate a reservation for an item
   *
   * @private - This method is only used internally by the service
   * @param user - The user making the reservation
   * @param cartItem - The item in the cart to create a reservation for
   * @param transaction - The transaction associated with the reservation
   * @returns - A promise that resolves with the reservation created
   */
  private async initiateReservation(
    user: User,
    cartItem: CartItem,
    transaction: Transaction
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      user,
      cartItem,
      transaction
    });
    return this.reservationRepository.save(reservation);
  }

  /**
   * Finalize a booking by processing the event tickets and revenue
   *
   * @private - This method is only used internally by the service
   * @param cartItems - The items in the cart to process
   * @param reservations - The reservations to finalize
   * @returns - A promise that resolves when the booking is complete
   */
  private async finalizeBooking(cartItems: CartItem[], reservations: Reservation[]): Promise<void> {
    const eventIds = new Set(cartItems.map(item => item.event.eventId));
    for (const eventId of eventIds) {
      const itemsForEvent = cartItems.filter(item => item.event.eventId === eventId);
      await this.eventSalesService.processEventTicketsAndRevenue(itemsForEvent);
    }
    await this.ticketService.generateTicketsForApprovedReservations(reservations);
  }

  /**
   * Ensure that a reservation does not already exist for an item
   *
   * @private - This method is only used internally by the service
   * @param item - The item to check for existing reservations
   * @param user - The user making the reservation
   * @throws Error if a reservation already exists for the item
   * @returns - A promise that resolves if there are no duplicate reservations
   */
  private async preventDuplicateReservation(item: CartItem, user: User): Promise<void> {
    const existingReservation = await this.reservationRepository.findOne({
      where: { cartItem: item, user }
    });
    if (existingReservation) {
      throw new Error(`Reservation already exists for item with ID ${item.cartItemId}.`);
    }
  }
  /**
   * Clean up after a payment
   *
   * @private - This method is only used internally by the service
   * @param cartId - The ID of the cart to clean up
   * @param userId - The ID of the user to clean up
   * @returns - A promise that resolves when the cleanup is complete
   * @throws Error if the cleanup fails
   */
  private async cleanUpAfterPayment(cartId: number, userId: number) {
    await this.cartItemsService.removeAllItemFromCart(userId, cartId);
    await this.cartService.deleteCart(cartId);
  }
}
