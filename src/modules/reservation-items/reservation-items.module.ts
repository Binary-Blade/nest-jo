import { Module } from '@nestjs/common';
import { ReservationItemsService } from './reservation-items.service';
import { ReservationItemsController } from './reservation-items.controller';

@Module({
  controllers: [ReservationItemsController],
  providers: [ReservationItemsService],
})
export class ReservationItemsModule {}
