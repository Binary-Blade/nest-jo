import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { User } from '@modules/users/entities/user.entity';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { PaymentService } from '@libs/payment/payment.service';
import { UsersService } from '@modules/users/users.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartsService } from '@modules/carts/carts.service';
import { EventPrice } from '@modules/event-prices/entities/event-price.entity';
import { EventPricesService } from '@modules/event-prices/event-prices.service';

/**
 * Module for handling tickets.
 * This module is used to create tickets for reservations.
 * This module imports the ReservationsModule to resolve circular dependencies.
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Reservation, Cart, CartItem, User, Event, EventPrice]),
    forwardRef(() => ReservationsModule) // Import the ReservationsModule with forwardRef
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    EncryptionService,
    EventPricesService,
    PaymentService,
    UsersService,
    CartItemsService,
    CartsService
  ],
  exports: [TicketsService]
})
export class TicketsModule {}
