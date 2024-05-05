import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@modules/events/entities/event.entity';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { Order } from './entities/order.entity';
import { PaymentService } from '@libs/payment/payment.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventPrice, Order, CartItem, Cart])], // Import the event entity and the Redis module
  controllers: [OrdersController],
  providers: [OrdersService, PaymentService, CartItemsService, CartsService]
})
export class OrdersModule {}
