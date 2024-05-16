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

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Event, ReservationDetails]),
    forwardRef(() => TicketsModule),
    EventsModule,
    CartsModule,
    CartItemsModule,
    TransactionsModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsProcessorService, ReservationDetailsService],
  exports: [ReservationsService, ReservationsProcessorService]
})
export class ReservationsModule {}
