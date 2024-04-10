import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Cart } from './entities/cart.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { OffersService } from '@modules/offers/offers.service';
import { Offer } from '@modules/offers/entities/offer.entity';
import { CartsService } from './carts.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart, Offer]), RedisModule],
  providers: [CartsService, RedisService, OffersService]
})
export class CartsModule {}
