import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/users/entities/user.entity';
import { PaymentService } from './payment.service';
import { ReservationsModule } from '@modules/reservations/reservations.module';
import { TransactionsModule } from '@modules/transactions/transactions.module';
import { TicketsModule } from '@modules/tickets/tickets.module';

/**
 * Module for handling payments.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ReservationsModule,
    TransactionsModule,
    TicketsModule
  ],
  providers: [PaymentService],
  exports: [PaymentService]
})
export class PaymentModule {}
