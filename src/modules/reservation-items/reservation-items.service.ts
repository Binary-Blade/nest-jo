import { Injectable } from '@nestjs/common';
import { CreateReservationItemDto } from './dto/create-reservation-item.dto';
import { UpdateReservationItemDto } from './dto/update-reservation-item.dto';

@Injectable()
export class ReservationItemsService {
  create(createReservationItemDto: CreateReservationItemDto) {
    return 'This action adds a new reservationItem';
  }

  findAll() {
    return `This action returns all reservationItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservationItem`;
  }

  update(id: number, updateReservationItemDto: UpdateReservationItemDto) {
    return `This action updates a #${id} reservationItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservationItem`;
  }
}
