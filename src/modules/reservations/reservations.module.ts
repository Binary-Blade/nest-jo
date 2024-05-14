import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartsService } from '@modules/carts/carts.service';
import { Event } from '@modules/events/entities/event.entity';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { EventsModule } from '@modules/events/events.module';
import { CommonModule } from '@modules/commom.module';
import { ReservationsProcessorService } from './reservations-processor.service';
import { User } from '@modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      CartItem,
      Cart,
      Event,
      Ticket,
      EventPrice,
      ReservationDetails,
      Transaction,
      User
    ]),
    forwardRef(() => TicketsModule),
    EventsModule,
    CommonModule
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    TicketsService,
    CartItemsService,
    CartsService,
    TransactionsService,
    ReservationDetailsService,
    ReservationsProcessorService
  ],
  exports: [ReservationsService, ReservationsProcessorService]
})
export class ReservationsModule {}
