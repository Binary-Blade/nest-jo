import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { EventsService } from '@modules/events/events.service';

/**
 * Service responsible for handling reservations.
 * This service is used to create, retrieve, and manage reservations.
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly ticketService: TicketsService,
    private readonly eventsService: EventsService,
    private readonly transactionService: TransactionsService,
    private readonly usersService: UsersService,
    private readonly cartService: CartsService,
    private readonly cartItemsService: CartItemsService,
    private readonly paymentService: PaymentService,
    private readonly reservationDetailsService: ReservationDetailsService
  ) {}

  async processBookingReservations(userId: number, cartId: number): Promise<Reservation[]> {
    const user = await this.usersService.verifyUserOneBy(userId);
    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
    if (!cartItems.length) throw new BadRequestException('No items found in the cart.');

    // Verify the cart and calculate the total price
    const cartTotalPrice = this.transactionService.calculateCartTotal(cartItems);
    // Process the payment
    const paymentResult = await this.paymentService.processPayment(cartTotalPrice);

    // Create a transaction for the payment
    const transaction = await this.transactionService.createTransaction(
      user,
      cartTotalPrice,
      paymentResult
    );
    let reservations = await this.processCartItems(cartItems, user, transaction);
    if (paymentResult.status === StatusReservation.APPROVED) {
      await this.finalizeBooking(cartItems, reservations);
    }
    await this.cleanUpAfterPayment(cartId, userId);
    return reservations;
  }

  private async processCartItems(
    cartItems: CartItem[],
    user: User,
    transaction: Transaction
  ): Promise<Reservation[]> {
    let reservations = [];
    for (const item of cartItems) {
      reservations.push(...(await this.createReservationsForItem(item, user, transaction)));
    }
    return reservations;
  }

  private async createReservationsForItem(
    item: CartItem,
    user: User,
    transaction: Transaction
  ): Promise<Reservation[]> {
    let reservations = [];
    for (let i = 0; i < item.quantity; i++) {
      let reservation = await this.createReservation(user, item, transaction);
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
  private async createReservation(
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

  private async finalizeBooking(cartItems: CartItem[], reservations: Reservation[]): Promise<void> {
    const eventIds = new Set(cartItems.map(item => item.event.eventId));
    for (const eventId of eventIds) {
      const itemsForEvent = cartItems.filter(item => item.event.eventId === eventId);
      await this.eventsService.processEventTicketsAndRevenue(itemsForEvent);
    }
    await this.ticketService.generateTicketsForApprovedReservations(reservations);
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

  /**
   * Ensure that a reservation does not already exist for an item
   *
   * @private - This method is only used internally by the service
   * @param item - The item to check for existing reservations
   * @param user - The user making the reservation
   * @throws Error if a reservation already exists for the item
   * @returns - A promise that resolves if there are no duplicate reservations
   */
  // private async ensureNoDuplicateReservation(item: CartItem, user: User): Promise<void> {
  //   const existingReservation = await this.reservationRepository.findOne({
  //     where: { cartItem: item, user }
  //   });
  //   if (existingReservation) {
  //     throw new Error(`Reservation already exists for item with ID ${item.cartItemId}.`);
  //   }
  // }

  /**
   * Find all reservations for a user
   *
   * @param userId - The ID of the user to find reservations for
   * @returns - A list of reservations for the user
   * @throws NotFoundException if the user does not exist
   */
  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['user', 'reservationDetails'] // Include the cartItem and event relations
    });
  }

  /**
   * Find all reservations for an admin
   *
   * @returns - A list of all reservations
   * @throws ForbiddenException if the user is not an admin
   * @throws NotFoundException if the user does not exist
   */
  async findAllAdmin() {
    return await this.reservationRepository.find();
  }

  /**
   * Find a single reservation by ID
   *
   * @param reservationId - The ID of the reservation to find
   * @param userId - The ID of the user making the request
   * @returns - The requested reservation
   * @throws NotFoundException if the reservation does not exist
   * @throws ForbiddenException if the user is not authorized to access the reservation
   */
  async findOne(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ['ticket', 'user', 'cartItem.event', 'reservationDetails'],
      select: {
        reservationId: true,
        ticket: {
          ticketId: true,
          qrCode: true
        }
      }
    });
    // Make sure the reservation belongs to the user
    if (!reservation || reservation.user.userId !== userId) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found.`);
    }
    return reservation;
  }

  /**
   * Save a reservation to the database
   *
   * @param reservation - The reservation to save
   * @returns - The saved reservation
   * @throws Error if the reservation cannot be saved
   */
  async saveReservation(reservation: Reservation): Promise<Reservation> {
    return await this.reservationRepository.save(reservation);
  }
}
