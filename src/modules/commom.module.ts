import { Global, Module } from '@nestjs/common';
import { UtilsService } from '@common/utils/utils.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { UsersService } from './users/users.service';
import { PaymentService } from '@libs/payment/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';

/**
 * Module for common services.
 */
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  providers: [UtilsService, UsersService, EncryptionService, PaymentService, RedisService],
  exports: [UsersService, UtilsService, EncryptionService, PaymentService, RedisService]
})
export class CommonModule {}
