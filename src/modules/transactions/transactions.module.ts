import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { EncryptionService } from '@security/encryption/encryption.service';
import { ReservationsService } from '@modules/reservations/reservations.service';
import { UsersService } from '@modules/users/users.service';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { User } from '@modules/users/entities/user.entity';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { CartsService } from '@modules/carts/carts.service';
import { PaymentService } from '@libs/payment/payment.service';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Event } from '@modules/events/entities/event.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { EventPricesService } from '@modules/events/event-prices.service';
import { EventsService } from '@modules/events/events.service';
import { EventPrice } from '@modules/events/entities/event-price.entity';
import { RedisModule } from '@database/redis/redis.module';
import { UtilsService } from '@common/utils/utils.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Ticket,
      Reservation,
      User,
      CartItem,
      Event,
      Cart,
      ReservationDetails,
      EventPrice
    ]),
    RedisModule
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TicketsService,
    EncryptionService,
    UsersService,
    ReservationsService,
    CartItemsService,
    CartsService,
    UtilsService,
    PaymentService,
    ReservationDetailsService,
    EventPricesService,
    EventsService
  ]
})
export class TransactionsModule {}
