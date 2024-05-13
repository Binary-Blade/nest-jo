import { Global, Module } from '@nestjs/common';
import { EncryptionService } from '@security/encryption/encryption.service';
import { UsersService } from './users/users.service';
import { PaymentService } from '@libs/payment/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { ConvertUtilsService } from '@utils/convert-utils.service';

/**
 * Module for common services.
 * This module is used to import and export common services used throughout the application.
 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  providers: [ConvertUtilsService, UsersService, EncryptionService, PaymentService, RedisService],
  exports: [UsersService, ConvertUtilsService, EncryptionService, PaymentService, RedisService]
})
export class CommonModule {}
