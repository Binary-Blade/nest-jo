import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
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
import { OrdersService } from '@modules/orders/orders.service';
import { PaymentResult } from '@common/interfaces/payment.interface';

/**
 * Service responsible for handling reservations.
 * This service is used to create, retrieve, and manage reservations.
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly ticketService: TicketsService,
    private readonly usersService: UsersService,
    private readonly cartService: CartsService,
    private readonly cartItemsService: CartItemsService,
    private readonly paymentService: PaymentService,
    private readonly ordersService: OrdersService
  ) {}

  /**
   * Create a new reservation
   *
   * @param userId - The ID of the user making the reservation
   * @param cartId - The ID of the cart to create the reservation from
   * @returns - The created reservation
   * @throws ForbiddenException if the user is not authorized to create the reservation
   * @throws NotFoundException if the cart does not exist
   * @throws Error if a reservation already exists for the item
   */
  async createReservations(userId: number, cartId: number): Promise<Reservation[]> {
    const user = await this.usersService.verifyUserOneBy(userId);
    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
    if (!cartItems.length) {
      throw new BadRequestException('No items found in the cart.');
    }
    await this.cartService.verifyCartRelation(cartId, 'cartItem');
    const cartTotalPrice = this.calculateCartTotal(cartItems);
    const paymentResult = await this.paymentService.processPayment(cartTotalPrice);

    let createdReservations: Reservation[] = [];
    for (const item of cartItems) {
      await this.generateOrderAndReservation(
        item,
        user,
        paymentResult,
        cartTotalPrice,
        createdReservations
      );
    }
    if (paymentResult.status === StatusReservation.APPROVED) {
      await this.issueTicketsForApprovedReservations(createdReservations);
    }

    await this.cleanUpAfterPayment(cartId, userId);
    await this.cartService.getOrCreateCart(user.userId);
    return createdReservations;
  }

  /**
   * Generate an order and reservation for a cart item
   *
   * @private - This method is only used internally by the service
   * @param item - The item to generate the order and reservation for
   * @param user - The user making the reservation
   * @param paymentResult - The result of the payment
   * @param cartTotalPrice - The total price of the cart
   * @param createdReservations - The list of reservations created so far
   * @throws InternalServerErrorException if the reservation or order cannot be created
   * @returns - A promise that resolves when the order and reservation are created
   */
  private async generateOrderAndReservation(
    item: CartItem,
    user: User,
    paymentResult: PaymentResult,
    cartTotalPrice: number,
    createdReservations: Reservation[]
  ) {
    await this.ensureNoDuplicateReservation(item, user);
    const newReservation = this.reservationRepository.create({
      user,
      cartItem: item
    });

    const savedReservation = await this.reservationRepository.save(newReservation);
    // Create a new reservation for each item in the cart
    if (savedReservation) {
      createdReservations.push(savedReservation);
    } else {
      throw new InternalServerErrorException('Failed to create reservation.');
    }

    // Create an order for the reservation if the payment is approved
    const newOrder = await this.ordersService.createOrderFromReservation(
      savedReservation,
      item,
      paymentResult,
      cartTotalPrice
    );
    if (!newOrder) {
      throw new InternalServerErrorException('Failed to create order from reservation.');
    }

    savedReservation.order = newOrder;
    await this.reservationRepository.save(savedReservation);
  }

  /**
   * Calculate the total price of a cart
   *
   * @private - This method is only used internally by the service
   * @param cartItems - The items in the cart
   * @returns - The total price of the cart
   */
  private calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
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
   * Issue tickets for approved reservations
   *
   * @private - This method is only used internally by the service
   * @param reservations - The reservations to issue tickets for
   * @returns - A promise that resolves when the tickets are issued
   * @throws Error if the ticket generation fails
   * @throws NotFoundException if the order is not found
   */
  private async issueTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      const order = await this.ordersService.findOrderByReservationId(reservation.reservationId);
      if (order && order.statusPayment === 'APPROVED') {
        await this.ticketService.generatedTickets(
          reservation.reservationId,
          reservation.user.userId
        );
      }
    }
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
  private async ensureNoDuplicateReservation(item: CartItem, user: User): Promise<void> {
    const existingReservation = await this.reservationRepository.findOne({
      where: { cartItem: item, user }
    });
    if (existingReservation) {
      throw new Error(`Reservation already exists for item with ID ${item.cartItemId}.`);
    }
  }

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
      relations: ['user', 'order'] // Include the cartItem and event relations
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
      relations: ['ticket', 'user', 'order'],
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
