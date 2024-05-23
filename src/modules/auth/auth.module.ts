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
 * Module to manage authentication.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for User entity
    TypeOrmModule.forFeature([User]),
    CartsModule, // Import CartsModule
    CommonModule // Import CommonModule
  ],
  controllers: [
    // Register AuthController
    AuthController
  ],
  providers: [
    // Register AuthService, TokenService, CookieService, JwtService, TokenManagementService, and RefreshTokenStoreService as providers
    AuthService,
    TokenService,
    CookieService,
    JwtService,
    TokenManagementService,
    RefreshTokenStoreService
  ]
})
export class AuthModule {}
