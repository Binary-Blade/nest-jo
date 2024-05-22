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
 * Service to process reservations for users.
 * @class
 */
@Injectable()
export class ReservationsProcessorService {
  /**
   * Constructor for the ReservationsProcessorService.
   *
   * @constructor
   * @param {Repository<Reservation>} reservationRepository - Repository for the Reservation entity.
   * @param {TicketsService} ticketService - Service to manage tickets.
   * @param {EventSalesService} eventSalesService - Service to manage event sales.
   * @param {TransactionsService} transactionService - Service to manage transactions.
   * @param {UsersService} usersService - Service to manage users.
   * @param {CartsService} cartService - Service to manage carts.
   * @param {CartItemsService} cartItemsService - Service to manage cart items.
   * @param {PaymentService} paymentService - Service to manage payments.
   * @param {ReservationDetailsService} reservationDetailsService - Service to manage reservation details.
   */
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
   * Processes a user's reservation based on their cart.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the user's cart.
   * @returns {Promise<Reservation[]>} - List of created reservations.
   *
   * @example
   * const reservations = await reservationsProcessorService.processUserReservation(1, 1);
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
   * Creates reservations for all items in the cart.
   *
   * @param {CartItem[]} cartItems - List of cart items.
   * @param {User} user - The user entity.
   * @param {Transaction} transaction - The transaction entity.
   * @returns {Promise<Reservation[]>} - List of created reservations.
   *
   * @private
   *
   * @example
   * const reservations = await reservationsProcessorService.createReservationsForAllCartItems(cartItems, user, transaction);
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
   * Creates reservations for each cart item.
   *
   * @param {CartItem} item - The cart item entity.
   * @param {User} user - The user entity.
   * @param {Transaction} transaction - The transaction entity.
   * @returns {Promise<Reservation[]>} - List of created reservations for the cart item.
   *
   * @private
   *
   * @example
   * const reservations = await reservationsProcessorService.createReservationsForEachCartItem(cartItem, user, transaction);
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
   * Initiates a new reservation.
   *
   * @param {User} user - The user entity.
   * @param {CartItem} cartItem - The cart item entity.
   * @param {Transaction} transaction - The transaction entity.
   * @returns {Promise<Reservation>} - The initiated reservation.
   *
   * @private
   *
   * @example
   * const reservation = await reservationsProcessorService.initiateReservation(user, cartItem, transaction);
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
   * Finalizes the booking process by updating event tickets and revenue.
   *
   * @param {CartItem[]} cartItems - List of cart items.
   * @param {Reservation[]} reservations - List of reservations.
   * @returns {Promise<void>}
   *
   * @private
   *
   * @example
   * await reservationsProcessorService.finalizeBooking(cartItems, reservations);
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
   * Prevents duplicate reservations for the same cart item and user.
   *
   * @param {CartItem} item - The cart item entity.
   * @param {User} user - The user entity.
   * @returns {Promise<void>}
   *
   * @throws {Error} If a duplicate reservation is found.
   *
   * @private
   *
   * @example
   * await reservationsProcessorService.preventDuplicateReservation(cartItem, user);
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
   * Cleans up after the payment process by removing cart items and deleting the cart.
   *
   * @param {number} cartId - ID of the cart.
   * @param {number} userId - ID of the user.
   * @returns {Promise<void>}
   *
   * @private
   *
   * @example
   * await reservationsProcessorService.cleanUpAfterPayment(1, 1);
   */
  private async cleanUpAfterPayment(cartId: number, userId: number): Promise<void> {
    await this.cartItemsService.removeAllItemFromCart(userId, cartId);
    await this.cartService.deleteCart(cartId);
    await this.cartService.getOrCreateCart(userId);
  }
}
