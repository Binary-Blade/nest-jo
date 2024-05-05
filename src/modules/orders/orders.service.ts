import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepository: Repository<Order>) {}

  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create({
      ...createOrderDto,
      createOrderDto.paymentId: Math.floor(Math.random() * 1000),
      title: event.title,
      description: event.description,
      quantity: reservation.cartItem.quantity,
      totalPrice: reservation.cartItem.total_price,
      priceFormula: reservation.cartItem.priceFormula,
      createdAt: new Date(),
      updatedAt: new Date()
    });
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
