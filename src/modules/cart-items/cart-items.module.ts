import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from './entities/cartitems.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { OffersService } from '@modules/offers/offers.service';
import { Offer } from '@modules/offers/entities/offer.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Offer]), RedisModule],
  controllers: [CartItemsController],
  providers: [CartsService, CartItemsService, RedisService, OffersService]
})
export class CartItemsModule {}
