import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  /**
   * Create an order from a reservation.
   *
   * @param reservation - The reservation to create the order from
   * @param cartItem - The cart item to create the order from
   * @param paymentResult - The payment result
   * @param totalPrice - The total price of the order
   * @returns - The created order
   * @throws NotFoundException if the reservation ID or event ID is not found
   * @throws NotFoundException if the event is not found
   */
  async createOrderFromReservation(
    reservation: Reservation,
    cartItem: CartItem,
    paymentResult: PaymentResult,
    totalPrice: number
  ): Promise<Order> {
    if (!cartItem.event) throw new NotFoundException('Event not found');
    const createOrderDto: CreateOrderDto = {
      paymentId: Math.floor(Math.random() * 1000),
      title: cartItem.event.title,
      description: cartItem.event.description,
      statusPayment: paymentResult.status,
      quantity: cartItem.quantity,
      totalPrice: totalPrice,
      priceFormula: cartItem.priceFormula
    };

    if (!reservation.reservationId) throw new NotFoundException('Reservation ID not found');
    if (!cartItem.event.eventId) throw new NotFoundException('Event ID not found');

    const newOrder = this.orderRepository.create({
      ...createOrderDto,
      event: { eventId: cartItem.event.eventId },
      reservation: { reservationId: reservation.reservationId }
    });
    return this.orderRepository.save(newOrder);
  }

  /**
   * Find an order by reservation ID.
   *
   * @param reservationId - The reservation ID to find the order by
   * @returns - The found order
   * @throws NotFoundException if the order is not found
   */
  async findOrderByReservationId(reservationId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { reservation: { reservationId } },
      relations: ['reservation']
    });

    if (!order) {
      throw new NotFoundException(`Order with reservation ID ${reservationId} not found.`);
    }

    return order;
  }
}
