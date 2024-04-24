import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { statusReservation } from '@common/enums/status-reservation.enum';
import { Ticket } from './entities/ticket.entity';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import * as qrcode from 'qrcode';
import { Cart } from '@modules/carts/entities/cart.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem) private readonly cartItemRepository: Repository<CartItem>
  ) {}

  async createReservations(
    userId: number,
    cartItems: CartItem[],
    cartId: number,
    status: statusReservation
  ): Promise<Reservation[]> {
    const user = await this.userRepository.findOneBy({ userId });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const cart = await this.cartRepository.findOne({
      where: { cartId },
      relations: ['cartItem'] // Assurez-vous que les cartItems sont chargés avec le panier
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }

    let createdReservations: Reservation[] = [];

    for (const item of cartItems) {
      const existingReservation = await this.reservationRepository.findOne({
        where: { cartItem: item, user: user }
      });

      if (existingReservation) {
        throw new Error(`Reservation for item with ID ${item.cartItemId} already exists.`);
      }

      item.cart.cartId = null;
      await this.cartItemRepository.save(item);
      const reservation = new Reservation();
      reservation.user = user;
      reservation.cartItem = item;
      reservation.paymentId = Math.floor(Math.random() * 1000); // Random payment ID
      reservation.totalPrice = item.price;
      reservation.status = status; // Set the reservation status based on the parameter
      const savedReservation = await this.reservationRepository.save(reservation);
      createdReservations.push(savedReservation);
    }
    await this.deleteCart(cartId);
    await this.createCartForUser(user); // Méthode pour créer un nouveau cart

    return createdReservations;
  }

  private async deleteCart(cartId: number): Promise<void> {
    const cart = await this.cartRepository.findOneBy({ cartId });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found.`);
    }
    await this.cartRepository.remove(cart);
  }

  private async createCartForUser(user: User): Promise<Cart> {
    const newCart = new Cart();
    newCart.user = user;
    return await this.cartRepository.save(newCart);
  }

  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['cartItem', 'cartItem.event', 'user'] // Include the cartItem and event relations
    });
  }

  async findAllAdmin() {
    return await this.reservationRepository.find();
  }

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

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found.`);
    }

    // Make sure the reservation belongs to the user
    if (reservation.user.userId !== userId) {
      throw new ForbiddenException(`Access to reservation with ID ${reservationId} is forbidden.`);
    }

    // Retrieve the user associated with the reservation
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return { reservation, user: reservation.user };
  }

  async issueTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
    for (const reservation of reservations) {
      if (reservation.status === statusReservation.APPROVED) {
        await this.confirmReservation(reservation.reservationId, reservation.user.userId);
      }
    }
  }

  private async confirmReservation(reservationId: number, userId: number): Promise<Ticket> {
    const { reservation, user } = await this.findOne(reservationId, userId);

    // Check if the reservation status is completed
    if (reservation.status !== statusReservation.APPROVED) {
      throw new Error('Reservation is not approved.');
    }

    // Generate purchase_key and secure_key
    const purchaseKey = uuidv4();
    const secureKey = `${user.accountKey}-${purchaseKey}`;
    const qrCodeUrl = await qrcode.toDataURL(secureKey);

    // Create the ticket with the generated keys and QR code
    const ticket = this.ticketRepository.create({
      reservation: reservation,
      purchaseKey: purchaseKey,
      secureKey: secureKey,
      qrCode: qrCodeUrl
    });

    const savedTicket = await this.ticketRepository.save(ticket);

    // Update reservation with the ticket ID
    reservation.ticketId = savedTicket.ticketId;
    await this.reservationRepository.save(reservation);

    return savedTicket;
  }
}
