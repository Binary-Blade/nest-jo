import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { EncryptionService } from '@security/encryption/encryption.service';
import { Cart } from '@modules/carts/entities/cart.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { User } from '@modules/users/entities/user.entity';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { PaymentService } from '@libs/payment/payment.service';
import { UsersService } from '@modules/users/users.service';
import { CartItemsService } from '@modules/cart-items/cart-items.service';
import { CartsService } from '@modules/carts/carts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Reservation, Cart, CartItem, User, Event]),
    forwardRef(() => ReservationsModule) // Add forwardRef to resolve circular dependency
  ],
  controllers: [TicketsController],
  providers: [
    TicketsService,
    EncryptionService,
    PaymentService,
    UsersService,
    CartItemsService,
    CartsService
  ],
  exports: [TicketsService]
})
export class TicketsModule {}
