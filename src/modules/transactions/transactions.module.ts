import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { CartsService } from '@modules/carts/carts.service';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { EventsModule } from '@modules/events/events.module';
import { CommonModule } from '@modules/commom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Ticket,
      Reservation,
      CartItem,
      Event,
      Cart,
      ReservationDetails,
      EventPrice
    ]),
    EventsModule,
    CommonModule
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TicketsService,
    ReservationsService,
    CartItemsService,
    CartsService,
    ReservationDetailsService
  ]
})
export class TransactionsModule {}
