import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { RedisService } from '@database/redis/redis.service';
import { RedisModule } from '@database/redis/redis.module';

/**
 * Module responsible for handling offers
 */
@Module({
  imports: [TypeOrmModule.forFeature([Offer]), RedisModule], // Import the offer entity and the Redis module
  controllers: [OffersController], // Declare the offers controller
  providers: [OffersService, RedisService] // Declare the offers service and the Redis service
})
export class OffersModule {}
