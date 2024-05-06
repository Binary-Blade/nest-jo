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
import { OrdersService } from '@modules/orders/orders.service';
import { PaymentResult } from '@common/interfaces/payment.interface';

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
    private readonly paymentService: PaymentService,
    private readonly ordersService: OrdersService
  ) {}

  async createReservations(userId: number, cartId: number): Promise<Reservation[]> {
    const user = await this.usersService.verifyUserOneBy(userId);
    const cartItems = await this.cartItemsService.findAllItemsInCart(userId, cartId);
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

    // Create a new reservation for each item in the cart
    const savedReservation = await this.reservationRepository.save(newReservation);
    createdReservations.push(savedReservation);

    // Create an order for the reservation if the payment is approved
    const newOrder = await this.ordersService.createOrderFromReservation(
      savedReservation,
      item,
      paymentResult,
      cartTotalPrice
    );

    savedReservation.order = newOrder;
    await this.reservationRepository.save(savedReservation);
  }

  private calculateCartTotal(cartItems: CartItem[]): number {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  private async cleanUpAfterPayment(cartId: number, userId: number) {
    await this.cartItemsService.removeAllItemFromCart(userId, cartId);
    await this.cartService.deleteCart(cartId);
  }

  async issueTicketsForApprovedReservations(reservations: Reservation[]): Promise<void> {
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

  private async ensureNoDuplicateReservation(item: CartItem, user: User): Promise<void> {
    const existingReservation = await this.reservationRepository.findOne({
      where: { cartItem: item, user }
    });
    if (existingReservation) {
      throw new Error(`Reservation already exists for item with ID ${item.cartItemId}.`);
    }
  }

  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['user', 'order'] // Include the cartItem and event relations
    });
  }

  async findAllAdmin() {
    return await this.reservationRepository.find();
  }

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

  async saveReservation(reservation: Reservation): Promise<Reservation> {
    return await this.reservationRepository.save(reservation);
  }
}
