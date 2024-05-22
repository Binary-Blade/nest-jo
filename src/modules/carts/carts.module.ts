import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartsService } from './carts.service';

/**
 * Module to manage carts.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for Cart entity
    TypeOrmModule.forFeature([Cart])
  ],
  providers: [
    // Register CartsService as a provider
    CartsService
  ],
  exports: [
    // Export CartsService
    CartsService
  ]
})
export class CartsModule {}
