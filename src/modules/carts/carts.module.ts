import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartitems.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { OffersService } from '@modules/offers/offers.service';
import { Offer } from '@modules/offers/entities/offer.entity';
import { CartsService } from './carts.service';
import { CartItemsService } from './cart-items.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, CartItem, Offer]), RedisModule],
  controllers: [CartsController],
  providers: [CartsService, CartItemsService, RedisService, OffersService]
})
export class CartsModule {}
