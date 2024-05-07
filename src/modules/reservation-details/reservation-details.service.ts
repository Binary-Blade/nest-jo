import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationDetails } from './entities/reservation-details.entity';
import { Repository } from 'typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { CreateReservationDetailsDto } from './dto/create-reservation-details.dto';

@Injectable()
export class ReservationDetailsService {
  constructor(
    @InjectRepository(ReservationDetails)
    private reservationDetailsRepository: Repository<ReservationDetails>
  ) {}

  /**
   * Create an order from a reservation.
   *
   * @param reservation - The reservation to create the order from
   * @param cartItem - The cart item to create the order from
   * @param paymentResult - The payment result
   * @param totalPrice - The total price of the order
   * @returns - The created order
   * @throws NotFoundException if the reservation ID or event ID is not found
   * @throws NotFoundException if the event is not found
   */
  async createReservationDetailsFromReservation(
    reservation: Reservation,
    cartItem: CartItem
  ): Promise<ReservationDetails> {
    if (!cartItem.event) {
      throw new NotFoundException('Event not found');
    }

    const createReservationDetailsDto: CreateReservationDetailsDto = {
      title: cartItem.event.title,
      description: cartItem.event.description,
      priceFormula: cartItem.priceFormula,
      price: cartItem.price
    };

    const newReservationDetails = this.reservationDetailsRepository.create({
      ...createReservationDetailsDto,
      event: { eventId: cartItem.event.eventId },
      reservation: { reservationId: reservation.reservationId }
    });

    return await this.reservationDetailsRepository.save(newReservationDetails);
  }

  async findOne(id: number): Promise<ReservationDetails> {
    const reservationDetails = await this.reservationDetailsRepository.findOne({
      where: { reservationDetailsId: id }
    });
    if (!reservationDetails)
      throw new NotFoundException(`Reservation details with id ${id} not found`);
    return reservationDetails;
  }
}
