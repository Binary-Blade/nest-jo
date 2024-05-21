import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ReservationDetailsService } from '@modules/reservation-details/reservation-details.service';
import { Event } from '@modules/events/entities/event.entity';
import { ReservationDetails } from '@modules/reservation-details/entities/reservation-details.entity';
import { User } from '@modules/users/entities/user.entity';
import { TicketsModule } from '@modules/tickets/tickets.module';
import { ReservationsModule } from '@modules/reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Event, ReservationDetails, User]),
    forwardRef(() => ReservationsModule),
    forwardRef(() => TicketsModule)
  ],
  providers: [TransactionsService, ReservationDetailsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
