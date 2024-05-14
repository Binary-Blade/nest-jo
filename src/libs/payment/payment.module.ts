import { Module } from '@nestjs/common';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { EventsModule } from '@modules/events/events.module';
import { CommonModule } from '@modules/commom.module';
import { ReservationsProcessorService } from '@modules/reservations/reservations-processor.service';
import { User } from '@modules/users/entities/user.entity';

/**
 * Module for handling payments.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      CartItem,
      Event,
      Cart,
      Ticket,
      EventPrice,
      ReservationDetails,
      Transaction,
      User
    ]),
    EventsModule,
    CommonModule
  ],
  providers: [
    TransactionsService,
    ReservationsService,
    CartItemsService,
    CartsService,
    TicketsService,
    ReservationDetailsService,
    ReservationsProcessorService
  ]
})
export class PaymentModule {}
