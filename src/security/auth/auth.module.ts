import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@security/token/token.service';
import { AuthController } from './auth.controller';
import { User } from '@modules/users/entities/user.entity';
import { TokenManagementService } from '@security/token/token-management.service';
import { CookieService } from '@security/cookie/cookie.service';
import { RefreshTokenStoreService } from '@security/token/refreshtoken-store.service';
import { CartsModule } from '@modules/carts/carts.module';
import { CommonModule } from '@modules/commom.module';

/**
 * Module for handling authentication-related operations.
 *
 * @class AuthModule class (module) for handling authentication-related operations
 * @method imports Import the necessary modules for this module
 * @method controllers Register the controllers that are part of this module
 * @method providers Register the services that are part of this module
 *
 */
@Module({
  imports: [TypeOrmModule.forFeature([User]), CartsModule, CommonModule], // Registers the User entity for TypeORM
  controllers: [AuthController], // The controllers that are part of this module
  providers: [
    AuthService, // The service responsible for handling authentication logic
    TokenService, // The service responsible for handling token-related operations
    CookieService, // The service responsible for handling cookie-related operations
    JwtService, // Nest's JwtService for JWT operations such as signing and verification
    TokenManagementService, // A service for managing JWT tokens
    RefreshTokenStoreService // A service for storing and verifying refresh tokens in Redis
  ]
})
export class AuthModule {}
