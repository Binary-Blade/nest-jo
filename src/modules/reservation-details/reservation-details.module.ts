import { Module } from '@nestjs/common';
import { ReservationDetailsService } from './reservation-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@modules/events/entities/event.entity';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { ReservationDetails } from './entities/reservation-details.entity';
import { PaymentService } from '@libs/payment/payment.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventPrice, ReservationDetails, CartItem, Cart])], // Import the event entity and the Redis module
  providers: [ReservationDetailsService, PaymentService, CartItemsService, CartsService]
})
export class ReservationDetailsModule {}
