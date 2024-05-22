import { Module } from '@nestjs/common';
import { ReservationDetailsService } from './reservation-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationDetails } from './entities/reservation-details.entity';
import { EventsModule } from '@modules/events/events.module';
import { CartItemsModule } from '@modules/cart-items/cart-items.module';

/**
 * Module to manage reservation details.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for Event and ReservationDetails entities
    TypeOrmModule.forFeature([Event, ReservationDetails]),
    CartItemsModule, // Import CartItemsModule
    EventsModule // Import EventsModule
  ],
  providers: [
    // Register ReservationDetailsService as a provider
    ReservationDetailsService
  ]
})
export class ReservationDetailsModule {}
