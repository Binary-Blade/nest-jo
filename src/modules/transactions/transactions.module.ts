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
import { QueryHelperService } from '@database/query/query-helper.service';
import { TransactionsController } from './transactions.controller';

/**
 * Module to manage transactions.
 *
 * @module
 */
@Module({
  imports: [
    // Import TypeOrmModule for Transaction, Event, ReservationDetails, and User entities
    TypeOrmModule.forFeature([Transaction, Event, ReservationDetails, User]),
    forwardRef(() => ReservationsModule), // Import ReservationsModule with forward reference
    forwardRef(() => TicketsModule) // Import TicketsModule with forward reference
  ],
  providers: [
    // Register TransactionsService, ReservationDetailsService, and QueryHelperService as providers
    TransactionsService,
    ReservationDetailsService,
    QueryHelperService
  ],
  controllers: [
    // Register TransactionsController
    TransactionsController
  ],
  exports: [
    // Export TransactionsService
    TransactionsService
  ]
})
export class TransactionsModule {}
