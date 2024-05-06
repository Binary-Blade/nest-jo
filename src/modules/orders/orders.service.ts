import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { PaymentResult } from '@common/interfaces/payment.interface';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  async createOrderFromReservation(
    reservation: Reservation,
    cartItem: CartItem,
    paymentResult: PaymentResult,
    totalPrice: number
  ): Promise<Order> {
    const createOrderDto: CreateOrderDto = {
      paymentId: Math.floor(Math.random() * 1000),
      title: cartItem.event.title,
      description: cartItem.event.description,
      statusPayment: paymentResult.status,
      quantity: cartItem.quantity,
      totalPrice: totalPrice,
      priceFormula: cartItem.priceFormula
    };
    const newOrder = this.orderRepository.create({
      ...createOrderDto,
      event: { eventId: cartItem.event.eventId },
      reservation: { reservationId: reservation.reservationId }
    });
    return this.orderRepository.save(newOrder);
  }

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

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
