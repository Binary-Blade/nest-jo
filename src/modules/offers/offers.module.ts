import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { RedisService } from '@database/redis/redis.service';
import { RedisModule } from '@database/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), RedisModule],
  controllers: [OffersController],
  providers: [OffersService, RedisService]
})
export class OffersModule {}
