import { Module, forwardRef } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { Cart } from '@modules/carts/entities/cart.entity';
import { User } from '@modules/users/entities/user.entity';
import { PaymentService } from '@libs/payment/payment.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartsService } from '@modules/carts/carts.service';
import { Event } from '@modules/events/entities/event.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { UsersService } from '@modules/users/users.service';
import { Ticket } from '@modules/tickets/entities/ticket.entity';
import { TicketsService } from '@modules/tickets/tickets.service';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { EventPrice } from '@modules/event-prices/entities/event-price.entity';
import { EventPricesService } from '@modules/event-prices/event-prices.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, CartItem, Cart, Event, User, Ticket, EventPrice]),
    forwardRef(() => TicketsModule)
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    PaymentService,
    TicketsService,
    CartItemsService,
    EventPricesService,
    CartsService,
    EncryptionService,
    UsersService
  ],
  exports: [ReservationsService]
})
export class ReservationsModule {}
