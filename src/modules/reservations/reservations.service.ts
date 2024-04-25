import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { statusReservation } from '@common/enums/status-reservation.enum';
import { Ticket } from './entities/ticket.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { UsersService } from '@modules/users/users.service';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';

/**
 * Service responsible for handling reservations.
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    private readonly encryptionService: EncryptionService,
    private readonly usersService: UsersService,
    private readonly cartService: CartsService,
    private readonly cartItemsService: CartItemsService
  ) {}

  /**
   * Creates a reservation for each item in the cart.
   *
   * @param userId The ID of the user creating the reservation.
   * @param cartItems The items in the cart.
   * @param cartId The ID of the cart.
   * @param status The status of the reservation.
   * @returns A promise resolved with the created reservations.
   * @throws Error if a reservation already exists for an item in the cart.
   */
  async createReservations(
    userId: number,
    cartItems: CartItem[],
    cartId: number,
    status: statusReservation
  ): Promise<Reservation[]> {
    const user = await this.usersService.verifyUserOneBy(userId);
    await this.cartService.verifyCartRelation(cartId, 'cartItem');

    let createdReservations: Reservation[] = [];
    for (const item of cartItems) {
      await this.preventDuplicateReservation(item, user);
      item.cart.cartId = null;

      await this.cartItemsService.save(item);
      // Create a new reservation for each item in the cart
      const newReservation = await this.addReservation(user, item, status);
      createdReservations.push(newReservation);
    }
    await this.cartService.deleteCart(cartId);
    await this.cartService.createCart(user.userId);
    return createdReservations;
  }

  /**
   * Confirms a reservation and generates a ticket.
   *
   * @param userId The ID of the user confirming the reservation.
   * @returns A promise resolved with the ticket.
   */
  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['cartItem', 'cartItem.event', 'user'] // Include the cartItem and event relations
    });
  }

  /**
   * Finds all reservations.
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
  async findOne(
    reservationId: number,
    userId: number
  ): Promise<{ reservation: Reservation; user: User }> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ['user', 'ticket'],
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
    // Retrieve the user associated with the reservation
    await this.usersService.verifyUserOneBy(userId);
    return { reservation, user: reservation.user };
  }

  /**
   * Updates a reservation's status.
   *
   * @param reservations The reservations to update.
   * @returns A promise resolved with the updated reservation entity.
   * @throws NotFoundException if the reservation is not found.
   */
  async issueTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      if (reservation.status === statusReservation.APPROVED) {
        await this.confirmReservation(reservation.reservationId, reservation.user.userId);
      }
    }
  }

  /**
   * Updates a reservation's status.
   *
   * @param item The item to check for duplicate reservations.
   * @param user The user creating the reservation.
   * @throws Error if a reservation already exists for the item.
   * @returns A promise resolved with the updated reservation entity.
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
   * Adds a reservation to the database.
   *
   * @param user The user creating the reservation.
   * @param item The item in the cart.
   * @param status The status of the reservation.
   * @returns A promise resolved with the created reservation.
   * @throws Error if the reservation could not be created.
   */
  private async addReservation(
    user: User,
    item: CartItem,
    status: statusReservation
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create({
      user,
      cartItem: item,
      status,
      paymentId: Math.floor(Math.random() * 1000),
      totalPrice: item.price
    });
    return await this.reservationRepository.save(reservation);
  }

  /**
   * Confirms a reservation and generates a ticket.
   *
   * @param reservationId The ID of the reservation to confirm.
   * @param userId The ID of the user confirming the reservation.
   * @returns A promise resolved with the ticket.
   * @throws Error if the reservation is not approved.
   */
  private async confirmReservation(reservationId: number, userId: number): Promise<Ticket> {
    const { reservation, user } = await this.findOne(reservationId, userId);
    // Check if the reservation status is completed
    if (reservation.status !== statusReservation.APPROVED) {
      throw new Error('Reservation is not approved.');
    }
    // Generate purchase_key and secure_key
    const qrcodeGenerated = await this.generateQRCode(user, reservation);
    // Update reservation with the ticket ID
    reservation.ticketId = qrcodeGenerated.ticketId;
    await this.reservationRepository.save(reservation);
    return qrcodeGenerated;
  }

  /**
   * Generates a QR code for a ticket.
   *
   * @param user The user creating the ticket.
   * @param reservation The reservation associated with the ticket.
   * @returns A promise resolved with the created ticket.
   * @throws Error if the QR code could not be generated.
   */
  private async generateQRCode(user: User, reservation: Reservation): Promise<Ticket> {
    const purchaseKey = await this.encryptionService.generatedKeyUuid();
    const secureKey = await this.encryptionService.generatedSecureKey(user);
    const qrCode = await this.encryptionService.generatedQRCode(secureKey);

    // Create the ticket with the generated keys and QR code
    const ticket = this.ticketRepository.create({
      reservation,
      purchaseKey,
      secureKey,
      qrCode
    });
    return await this.ticketRepository.save(ticket);
  }
}
