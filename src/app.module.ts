import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users/users.module';
import { RedisModule } from '@database/redis/redis.module';
import { DatabaseModule } from '@database/database.module';
import { AuthModule } from '@security/auth/auth.module';
import { CartsModule } from '@modules/carts/carts.module';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { CartItemsModule } from '@modules/cart-items/cart-items.module';
import { PaymentModule } from '@libs/payment/payment.module';
import { EventsModule } from '@modules/events/events.module';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { ThrollerModule } from '@security/throttler/throttler.module';
import { TransactionsModule } from '@modules/transactions/transactions.module';

/**
 * The root module of the application.
 *
 * @module
 */
@Module({
  imports: [
    // Global configuration module that loads environment variables.
    ConfigModule.forRoot({
      envFilePath: `./.${process.env.NODE_ENV || ''}.env`, // Load conditionally the environment variables based on the current environment
      isGlobal: true // Make the configuration module global
    }),
    DatabaseModule, // Import DatabaseModule for database connections
    RedisModule, // Import RedisModule for Redis connections
    AuthModule, // Import AuthModule for authentication
    UsersModule, // Import UsersModule for user management
    EventsModule, // Import EventsModule for event management
    CartsModule, // Import CartsModule for cart management
    CartItemsModule, // Import CartItemsModule for cart items management
    ReservationsModule, // Import ReservationsModule for reservation management
    PaymentModule, // Import PaymentModule for payment processing
    TicketsModule, // Import TicketsModule for ticket management
    TransactionsModule, // Import TransactionsModule for transaction management
    ThrollerModule // Import ThrollerModule for request throttling
  ]
})
export class AppModule {}
