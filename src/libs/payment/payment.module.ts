import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { EventPricesService } from '@modules/event-prices/event-prices.service';
import { EventPrice } from '@modules/event-prices/entities/event-price.entity';

/**
 * Module for handling payments.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, CartItem, Event, Cart, User, Ticket, EventPrice])
  ],
  providers: [
    PaymentService,
    ReservationsService,
    CartItemsService,
    CartsService,
    UsersService,
    EventPricesService,
    EncryptionService,
    TicketsService
  ]
})
export class PaymentModule {}
