import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartsService } from '@modules/carts/carts.service';
import { EventPricesService } from '@modules/events/event-prices.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { CommonModule } from '@modules/commom.module';
import { User } from '@modules/users/entities/user.entity';

/**
 * Module for handling tickets.
 * This module is used to create tickets for reservations.
 * This module imports the ReservationsModule to resolve circular dependencies.
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Reservation,
      Cart,
      CartItem,
      Event,
      EventPrice,
      ReservationDetails,
      Transaction,
      User
    ]),
    forwardRef(() => ReservationsModule), // Import the ReservationsModule with forwardRef
    CommonModule
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    EventPricesService,
    CartItemsService,
    ReservationDetailsService,
    EventPricesService,
    CartsService,
    TransactionsService
  ],
  exports: [TicketsService]
})
export class TicketsModule {}
