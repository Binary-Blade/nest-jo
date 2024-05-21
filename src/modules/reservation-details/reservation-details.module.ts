import { Module } from '@nestjs/common';
import { ReservationDetailsService } from './reservation-details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationDetails } from './entities/reservation-details.entity';
import { EventsModule } from '@modules/events/events.module';
import { CartItemsModule } from '@modules/cart-items/cart-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event, ReservationDetails]), CartItemsModule, EventsModule],
  providers: [ReservationDetailsService]
})
export class ReservationDetailsModule {}
