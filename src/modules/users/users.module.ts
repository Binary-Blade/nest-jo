import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { QueryHelperService } from '@database/query/query-helper.service';
import { AccessTokenStrategy } from '@security/strategies/access-token.strategy';

/**
 * Module to manage users.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for User and Transaction entities
    TypeOrmModule.forFeature([User, Transaction])
  ],
  controllers: [
    // Register UsersController
    UsersController
  ],
  providers: [
    // Register UsersService, QueryHelperService, and AccessTokenStrategy as providers
    UsersService,
    QueryHelperService,
    AccessTokenStrategy
  ]
})
export class UsersModule {}
