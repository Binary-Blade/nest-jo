import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationDetails } from './entities/reservation-details.entity';
import { Repository } from 'typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { CreateReservationDetailsDto } from './dto/create-reservation-details.dto';
import { Event } from '@modules/events/entities/event.entity';

@Injectable()
export class ReservationDetailsService {
  constructor(
    @InjectRepository(ReservationDetails)
    private reservationDetailsRepository: Repository<ReservationDetails>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {}

  /**
   * Create a new reservation details from a reservation and a cart item.
   *
   * @param reservation - The reservation to create the details for
   * @param cartItem - The cart item to create the details from
   * @returns - The created reservation details
   * @throws NotFoundException if the event is not found
   */
  async createReservationDetailsFromReservation(
    reservation: Reservation,
    cartItem: CartItem
  ): Promise<ReservationDetails> {
    if (!cartItem.event) {
      throw new NotFoundException('Event ID is not found in CartItem');
    }

    // Fetch event using eventId from the cartItem
    const event = await this.eventRepository.findOne({
      where: { eventId: cartItem.event.eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Create DTO from event details
    const createReservationDetailsDto: CreateReservationDetailsDto = {
      title: event.title,
      shortDescription: event.shortDescription,
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

  /**
   * Find a reservation details by ID.
   *
   * @param id - The ID of the reservation details to find
   * @returns - The reservation details
   * @throws NotFoundException if the reservation details is not found
   */
  async findOne(id: number): Promise<ReservationDetails> {
    const reservationDetails = await this.reservationDetailsRepository.findOne({
      where: { reservationDetailsId: id },
      relations: ['event', 'reservation']
    });
    if (!reservationDetails)
      throw new NotFoundException(`Reservation details with id ${id} not found`);
    return reservationDetails;
  }
}
