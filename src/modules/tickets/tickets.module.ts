import { Module, forwardRef } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { Transaction } from '@modules/transactions/entities/transaction.entity';
import { User } from '@modules/users/entities/user.entity';
import { ReservationDetailsModule } from '@modules/reservation-details/reservation-details.module';
import { TransactionsModule } from '@modules/transactions/transactions.module';

/**
 * Module for handling tickets.
 * This module is used to create tickets for reservations.
 * This module imports the ReservationsModule to resolve circular dependencies.
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, Transaction, User]),
    forwardRef(() => ReservationsModule), // Import the ReservationsModule with forwardRef
    forwardRef(() => ReservationDetailsModule), // Import the ReservationsModule with forwardRef
    TransactionsModule
  ],
  providers: [TicketsService],
  exports: [TicketsService]
})
export class TicketsModule {}
