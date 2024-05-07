import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from './carts.service';
import { UtilsService } from '@common/utils/utils.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { EventsModule } from '@modules/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cart, Event, EventPrice, ReservationDetails]),
    RedisModule,
    EventsModule
  ],
  providers: [CartsService, RedisService, UtilsService]
})
export class CartsModule {}
