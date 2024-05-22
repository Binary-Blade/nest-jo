import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { EventsModule } from '@modules/events/events.module';
import { ReservationsProcessorService } from './reservations-processor.service';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { CartsModule } from '@modules/carts/carts.module';
import { CartItemsModule } from '@modules/cart-items/cart-items.module';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { QueryHelperService } from '@database/query/query-helper.service';

/**
 * Module to manage reservations.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for Reservation, Event, and ReservationDetails entities
    TypeOrmModule.forFeature([Reservation, Event, ReservationDetails]),
    forwardRef(() => TicketsModule), // Import TicketsModule with forward reference
    EventsModule, // Import EventsModule
    CartsModule, // Import CartsModule
    CartItemsModule, // Import CartItemsModule
    TransactionsModule // Import TransactionsModule
  ],
  controllers: [
    // Register ReservationsController
    ReservationsController
  ],
  providers: [
    // Register services as providers
    ReservationsService,
    ReservationsProcessorService,
    ReservationDetailsService,
    QueryHelperService
  ],
  exports: [
    // Export ReservationsService and ReservationsProcessorService
    ReservationsService,
    ReservationsProcessorService
  ]
})
export class ReservationsModule {}
