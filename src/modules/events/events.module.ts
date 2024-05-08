import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventPrice } from './entities/event-price.entity';
import { EventPricesService } from './event-prices.service';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { EventSalesService } from './event-sales.service';
import { CommonModule } from '@modules/commom.module';

/**
 * Module responsible for handling events
 */
@Module({
  imports: [TypeOrmModule.forFeature([Event, EventPrice, ReservationDetails]), CommonModule], // Import the event entity and the Redis module
  controllers: [EventsController], // Declare the events controller
  providers: [EventsService, EventPricesService, EventSalesService],
  exports: [EventsService, EventPricesService, EventSalesService] // Export the events service
})
export class EventsModule {}
