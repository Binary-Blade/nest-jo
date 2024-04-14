import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { statusReservation } from '@common/enums/status-reservation.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async createReservations(userId: number, paymentId: number, cartItems: any[]) {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    for (const item of cartItems) {
      const reservationDto = new CreateReservationDto();
      reservationDto.userId = userId;
      reservationDto.paymentId = paymentId;
      reservationDto.cartItemId = item.cartItemId;
      reservationDto.status = statusReservation.PENDING;
      reservationDto.totalPrice = item.offer.price * item.quantity;

      const reservation = this.reservationRepository.create(reservationDto);
      await this.reservationRepository.save(reservation);
    }
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
