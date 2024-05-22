import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationDetails } from './entities/reservation-details.entity';
import { Repository } from 'typeorm';
import { Reservation } from '@modules/reservations/entities/reservation.entity';
import { CartItem } from '@modules/cart-items/entities/cartitems.entity';
import { CreateReservationDetailsDto } from './dto/create-reservation-details.dto';
import { Event } from '@modules/events/entities/event.entity';

/**
 * Service to manage reservation details.
 * @class
 */
@Injectable()
export class ReservationDetailsService {
  /**
   * Creates an instance of ReservationDetailsService.
   *
   * @constructor
   * @param {Repository<ReservationDetails>} reservationDetailsRepository - Repository for the ReservationDetails entity.
   * @param {Repository<Event>} eventRepository - Repository for the Event entity.
   */
  constructor(
    @InjectRepository(ReservationDetails)
    private reservationDetailsRepository: Repository<ReservationDetails>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>
  ) {}

  /**
   * Creates reservation details from a reservation and cart item.
   *
   * @param {Reservation} reservation - The reservation entity.
   * @param {CartItem} cartItem - The cart item entity.
   * @returns {Promise<ReservationDetails>} - The created reservation details.
   *
   * @throws {NotFoundException} If the event is not found in the cart item or in the repository.
   *
   * @example
   * const reservationDetails = await reservationDetailsService.createReservationDetailsFromReservation(reservation, cartItem);
   */
  async createReservationDetailsFromReservation(
    reservation: Reservation,
    cartItem: CartItem
  ): Promise<ReservationDetails> {
    if (!cartItem.event) {
      throw new NotFoundException('Event ID is not found in CartItem');
    }

    const event = await this.eventRepository.findOne({
      where: { eventId: cartItem.event.eventId }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

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
   * Finds a reservation detail by its ID.
   *
   * @param {number} id - ID of the reservation detail.
   * @returns {Promise<ReservationDetails>} - The found reservation detail.
   *
   * @throws {NotFoundException} If the reservation detail is not found.
   *
   * @example
   * const reservationDetails = await reservationDetailsService.findOne(1);
   */
  async findOne(id: number): Promise<ReservationDetails> {
    const reservationDetails = await this.reservationDetailsRepository.findOne({
      where: { reservationDetailsId: id },
      relations: ['event', 'reservation']
    });
    if (!reservationDetails) {
      throw new NotFoundException(`Reservation details with id ${id} not found`);
    }
    return reservationDetails;
  }
}
