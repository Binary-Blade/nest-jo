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
import { AppController } from './app.controller';
import { ThrollerModule } from '@security/throttler/throttler.module';
import { EventPricesModule } from '@modules/event-prices/event-prices.module';
/**
 *
 * Main application module
 *
 * @class AppModule class (module) for the main application
 * @method imports Import the necessary modules for this application
 * @returns AppModule
 */
@Module({
  imports: [
    // Global configuration module that loads environment variables.
    ConfigModule.forRoot({
      envFilePath: `./.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
    EventsModule,
    EventPricesModule,
    CartsModule,
    CartItemsModule,
    ReservationsModule,
    PaymentModule,
    TicketsModule,
    ThrollerModule
  ],
  controllers: [AppController]
})
export class AppModule {}
