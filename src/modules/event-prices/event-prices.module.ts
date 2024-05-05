import { Module } from '@nestjs/common';
import { EventPricesService } from './event-prices.service';
import { EventPricesController } from './event-prices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@modules/events/entities/event.entity';
import { EventPrice } from './entities/event-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventPrice])], // Import the event entity and the Redis module
  controllers: [EventPricesController],
  providers: [EventPricesService]
})
export class EventPricesModule {}
