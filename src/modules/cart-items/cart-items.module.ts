import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { CartItem } from './entities/cartitems.entity';
import { RedisModule } from '@database/redis/redis.module';
import { RedisService } from '@database/redis/redis.service';
import { EventsService } from '@modules/events/events.service';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsService } from '@modules/carts/carts.service';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { UtilsService } from '@common/utils/utils.service';
import { TicketsService } from '@modules/tickets/tickets.service';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { UsersService } from '@modules/users/users.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { PaymentService } from '@libs/payment/payment.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { EventPricesService } from '@modules/events/event-prices.service';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { TransactionsService } from '@modules/transactions/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Cart,
      CartItem,
      Event,
      Ticket,
      Reservation,
      EventPrice,
      ReservationDetails,
      Transaction
    ]),
    RedisModule
  ],
  controllers: [CartItemsController],
  providers: [
    CartsService,
    CartItemsService,
    RedisService,
    EventsService,
    EventPricesService,
    TicketsService,
    EncryptionService,
    UsersService,
    ReservationsService,
    UtilsService,
    ReservationDetailsService,
    PaymentService,
    TransactionsService
  ]
})
export class CartItemsModule {}
