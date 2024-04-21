import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { EventsService } from '@modules/events/events.service';
import { Event } from '@modules/events/entities/event.entity';
import { CartsService } from './carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Event]), RedisModule],
  providers: [CartsService, RedisService, EventsService]
})
export class CartsModule {}
