import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccessTokenStrategy } from '@security/auth/strategies/access-token.strategy';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { QueryHelperService } from '@database/query/query-helper.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])], // Registers the User entity for TypeORM
  controllers: [UsersController], // The controllers that are part of this module
  providers: [
    UsersService, // The service responsible for user-related operations
    QueryHelperService, // QueryHelperService provides utility functions for building TypeORM queries
    AccessTokenStrategy // AccessTokenStrategy implements JWT validation logic for Passport.
  ]
})
export class UsersModule {}
