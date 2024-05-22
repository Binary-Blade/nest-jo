import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventPrice } from './entities/event-price.entity';
import { EventPricesService } from './event-prices.service';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { EventSalesService } from './event-sales.service';
import { QueryHelperService } from '@database/query/query-helper.service';

/**
 * Module to manage events.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for Event, EventPrice, and ReservationDetails entities
    TypeOrmModule.forFeature([Event, EventPrice, ReservationDetails])
  ],
  controllers: [
    // Register EventsController
    EventsController
  ],
  providers: [
    // Register EventsService, EventPricesService, EventSalesService, and QueryHelperService as providers
    EventsService,
    EventPricesService,
    EventSalesService,
    QueryHelperService
  ],
  exports: [
    // Export EventsService, EventPricesService, and EventSalesService
    EventsService,
    EventPricesService,
    EventSalesService
  ]
})
export class EventsModule {}
