import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { TicketsService } from '@modules/tickets/tickets.service';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { EventsModule } from '@modules/events/events.module';
import { CommonModule } from '@modules/commom.module';
import { ReservationsProcessorService } from '@modules/reservations/reservations-processor.service';
import { User } from '@modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Event,
      Ticket,
      Reservation,
      EventPrice,
      ReservationDetails,
      Transaction,
      User
    ]),
    EventsModule,
    CommonModule
  ],
  controllers: [CartItemsController],
  providers: [
    CartsService,
    CartItemsService,
    TicketsService,
    ReservationsService,
    ReservationDetailsService,
    ReservationsProcessorService,
    TransactionsService
  ]
})
export class CartItemsModule {}
