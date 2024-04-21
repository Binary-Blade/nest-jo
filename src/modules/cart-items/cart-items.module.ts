import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from './entities/cartitems.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { EventsService } from '@modules/events/events.service';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Event]), RedisModule],
  controllers: [CartItemsController],
  providers: [CartsService, CartItemsService, RedisService, EventsService]
})
export class CartItemsModule {}
