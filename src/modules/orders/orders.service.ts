import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const order = this.orderRepository.create({
        ...createOrderDto,
        event: { eventId: createOrderDto.eventId },
        reservation: { reservationId: createOrderDto.reservationId }
      });
      const savedOrder = await this.orderRepository.save(order);
      return savedOrder;
    } catch (error) {
      console.error('Error saving order:', error);
      throw new Error('Failed to save order. ' + error.message);
    }
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
