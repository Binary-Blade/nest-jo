import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { EventsService } from '@modules/events/events.service';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from './carts.service';
import { EventPrice } from '@modules/event-prices/entities/event-price.entity';
import { EventPricesService } from '@modules/event-prices/event-prices.service';
import { UtilsService } from '@common/utils/utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Event, EventPrice]), RedisModule],
  providers: [CartsService, RedisService, EventsService, EventPricesService, UtilsService]
})
export class CartsModule {}
