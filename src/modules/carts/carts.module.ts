import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { EventsService } from '@modules/events/events.service';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from './carts.service';
import { UtilsService } from '@common/utils/utils.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { EventPricesService } from '@modules/events/event-prices.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Event, EventPrice]), RedisModule],
  providers: [CartsService, RedisService, EventsService, UtilsService, EventPricesService]
})
export class CartsModule {}
