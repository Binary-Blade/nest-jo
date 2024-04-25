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
import { Ticket } from '@modules/reservations/entities/ticket.entity';
import { EncryptionService } from '@security/encryption/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, CartItem, Event, Cart, User, Ticket])],
  providers: [
    PaymentService,
    ReservationsService,
    CartItemsService,
    CartsService,
    UsersService,
    EncryptionService
  ]
})
export class PaymentModule {}
