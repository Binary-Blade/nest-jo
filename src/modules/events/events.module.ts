import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '@database/redis/redis.service';
import { RedisModule } from '@database/redis/redis.module';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { EventsController } from './events.controller';
import { UtilsService } from '@common/utils/utils.service';
import { EventPrice } from './entities/event-price.entity';
import { EventPricesService } from './event-prices.service';

/**
 * Module responsible for handling events
 */
@Module({
  imports: [TypeOrmModule.forFeature([Event, EventPrice]), RedisModule], // Import the event entity and the Redis module
  controllers: [EventsController], // Declare the events controller
  providers: [EventsService, RedisService, EventPricesService, UtilsService] // Declare the events service and the Redis service
})
export class EventsModule {}
