import { Injectable, NotFoundException } from '@nestjs/common';
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

/**
 * Service responsible for handling reservations.
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly ticketService: TicketsService,
    private readonly usersService: UsersService,
    private readonly cartService: CartsService,
    private readonly cartItemsService: CartItemsService,
    private readonly paymentService: PaymentService
  ) {}

  /**
   * Creates a reservation for each item in the cart.
   *
   * @param userId The ID of the user creating the reservation.
   * @param cartId The ID of the cart.
   * @returns A promise resolved with the list of created reservations.
   * @throws Error if the reservation already exists for an item in the cart.
   */
  async createReservations(userId: number, cartId: number): Promise<Reservation[]> {
    const user = await this.usersService.verifyUserOneBy(userId);
    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
    await this.cartService.verifyCartRelation(cartId, 'cartItem');
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const paymentResult = await this.paymentService.processPayment(cartTotal);

    let createdReservations: Reservation[] = [];
    for (const item of cartItems) {
      await this.preventDuplicateReservation(item, user);
      item.cart.cartId = null;

      await this.cartItemsService.save(item);
      // Create a new reservation for each item in the cart
      const newReservation = await this.addReservation(user, item, paymentResult.status);
      //await this.issueTicketsForApprovedReservations();
      createdReservations.push(newReservation);
    }
    if (paymentResult.status === StatusReservation.APPROVED) {
      await this.issueTicketsForApprovedReservations(createdReservations);
    }
    await this.cartService.deleteCart(cartId);
    await this.cartService.getOrCreateCart(user.userId);
    return createdReservations;
  }

  /**
   * Finds all reservations for a user.
   *
   * @param userId The ID of the user to find.
   * @returns A promise resolved with the list of all reservation entities.
   * @throws NotFoundException if the reservation is not found.
   */
  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['cartItem', 'cartItem.event', 'user'] // Include the cartItem and event relations
    });
  }

  /**
   * Finds all reservations for Admin.
   *
   * @returns A promise resolved with the list of all reservation entities.
   * @throws NotFoundException if the reservation is not found.
   */
  async findAllAdmin() {
    return await this.reservationRepository.find();
  }

  /**
   * Finds a single reservation by its ID.
   *
   * @param reservationId The ID of the reservation to find.
   * @param userId The ID of the user to find.
   * @returns A promise resolved with the reservation entity.
   * @throws NotFoundException if the reservation is not found.
   */
  async findOne(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ['ticket', 'user'],
      select: {
        reservationId: true,
        status: true,
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
   * Finds a single reservation by its ID.
   *
   * @param reservationId The ID of the reservation to find.
   * @returns A promise resolved with the reservation entity.
   * @throws NotFoundException if the reservation is not found.
   */
  async issueTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      if (reservation.status === StatusReservation.APPROVED) {
        await this.ticketService.createTickets(reservation.reservationId, reservation.user.userId);
      }
    }
  }

  /**
   * Add a reservation to the database.
   *
   * @param user The user creating the reservation.
   * @param item The item being reserved.
   * @param status The status of the reservation.
   * @returns A promise resolved with the created reservation.
   * @throws Error if the reservation already exists for the item.
   */
  private async addReservation(
    user: User,
    item: CartItem,
    status: StatusReservation
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      user,
      cartItem: item,
      status,
      paymentId: Math.floor(Math.random() * 1000),
      totalPrice: item.price
    });
    return await this.saveReservation(reservation);
  }

  /**
   * Prevents duplicate reservations for the same item.
   *
   * @param item The item being reserved.
   * @param user The user creating the reservation.
   * @returns A promise resolved with void.
   * @throws Error if the reservation already exists for the item.
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
   * Save a reservation to the database.
   *
   * @param reservation The reservation to save.
   * @returns A promise resolved with the saved reservation.
   */
  async saveReservation(reservation: Reservation): Promise<Reservation> {
    return await this.reservationRepository.save(reservation);
  }
}
