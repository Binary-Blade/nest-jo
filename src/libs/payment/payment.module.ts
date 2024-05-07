import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { UsersService } from '@modules/users/users.service';
import { User } from '@modules/users/entities/user.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { EventPricesService } from '@modules/events/event-prices.service';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';
import { EventsService } from '@modules/events/events.service';
import { RedisModule } from '@database/redis/redis.module';
import { UtilsService } from '@common/utils/utils.service';

/**
 * Module for handling payments.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservation,
      CartItem,
      Event,
      Cart,
      User,
      Ticket,
      EventPrice,
      ReservationDetails,
      Transaction
    ]),
    RedisModule
  ],
  providers: [
    PaymentService,
    TransactionsService,
    ReservationsService,
    CartItemsService,
    EventsService,
    UtilsService,
    CartsService,
    UsersService,
    EncryptionService,
    TicketsService,
    ReservationDetailsService,
    EventPricesService
  ]
})
export class PaymentModule {}
