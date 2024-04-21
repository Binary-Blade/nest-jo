import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { User } from '@modules/users/entities/user.entity';
import { PaymentService } from '@libs/payment/payment.service';
import { Ticket } from './entities/ticket.entity';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartsService } from '@modules/carts/carts.service';
import { Event } from '@modules/events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, CartItem, Cart, Event, User, Ticket])],
  controllers: [ReservationsController],
  providers: [ReservationsService, PaymentService, CartItemsService, CartsService]
})
export class ReservationsModule {}
