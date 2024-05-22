import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { EventsModule } from '@modules/events/events.module';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { CartsModule } from '@modules/carts/carts.module';

/**
 * Module to manage cart items.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for CartItem, Event, and ReservationDetails entities
    TypeOrmModule.forFeature([CartItem, Event, ReservationDetails]),
    EventsModule, // Import EventsModule
    CartsModule, // Import CartsModule
    forwardRef(() => ReservationsModule) // Import ReservationsModule with forward reference
  ],
  controllers: [CartItemsController], // Register CartItemsController
  providers: [CartItemsService, ReservationDetailsService], // Register CartItemsService and ReservationDetailsService as providers
  exports: [CartItemsService] // Export CartItemsService
})
export class CartItemsModule {}
