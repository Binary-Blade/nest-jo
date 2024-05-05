import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '@modules/events/entities/event.entity';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventPrice, Order])], // Import the event entity and the Redis module
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
