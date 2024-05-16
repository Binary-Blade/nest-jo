import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cartitems.entity';
import { Event } from '@modules/events/entities/event.entity';
import { CartItemsController } from './cart-items.controller';
import { CartItemsService } from './cart-items.service';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { EventsModule } from '@modules/events/events.module';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { CartsModule } from '@modules/carts/carts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Event, ReservationDetails]),
    EventsModule,
    CartsModule,
    forwardRef(() => ReservationsModule)
  ],
  controllers: [CartItemsController],
  providers: [CartItemsService, ReservationDetailsService],
  exports: [CartItemsService]
})
export class CartItemsModule {}
