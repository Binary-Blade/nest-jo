import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationsProcessorService } from './reservations-processor.service';

/**
 * Service responsible for handling reservations.
 * This service is used to create, retrieve, and manage reservations.
 */
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly reservationProcessorService: ReservationsProcessorService
  ) {}

  /**
   * Generate a reservation for a user
   *
   * @param userId - The ID of the user to generate a reservation for
   * @param cartId - The ID of the cart to generate a reservation from
   * @returns - A list of reservations created
   * @throws Error if the reservation cannot be generated
   */
  async generateReservation(userId: number, cartId: number): Promise<Reservation[]> {
    return await this.reservationProcessorService.processUserReservation(userId, cartId);
  }

  /**
   * Find all reservations for a user
   *
   * @param userId - The ID of the user to find reservations for
   * @returns - A list of reservations for the user
   * @throws NotFoundException if the user does not exist
   */
  async findAll(userId: number) {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
      select: {
        reservationId: true,
        reservationDetails: {
          title: true,
          description: true,
          price: true,
          priceFormula: true,
          event: {
            eventId: true,
            title: true,
            description: true,
            categoryType: true,
            startDate: true,
            endDate: true
          }
        },
        transaction: {
          statusPayment: true,
          paymentId: true
        }
      }
    });
  }

  /**
   * Find all reservations for an admin
   *
   * @returns - A list of all reservations
   * @throws ForbiddenException if the user is not an admin
   * @throws NotFoundException if the user does not exist
   */
  async findAllAdmin() {
    return await this.reservationRepository.find();
  }

  /**
   * Find a single reservation by ID
   *
   * @param reservationId - The ID of the reservation to find
   * @param userId - The ID of the user making the request
   * @returns - The requested reservation
   * @throws NotFoundException if the reservation does not exist
   * @throws ForbiddenException if the user is not authorized to access the reservation
   */
  async findOne(reservationId: number, userId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId },
      relations: ['ticket', 'user'],
      select: {
        reservationId: true,
        ticket: {
          ticketId: true,
          qrCode: true
        },
        user: {
          userId: true
        }
      }
    });
    if (!reservation || reservation.user.userId !== userId) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found.`);
    }
    return reservation;
  }

  /**
   * Save a reservation to the database
   *
   * @param reservation - The reservation to save
   * @returns - The saved reservation
   * @throws Error if the reservation cannot be saved
   */
  async saveReservation(reservation: Reservation): Promise<Reservation> {
    return await this.reservationRepository.save(reservation);
  }
}
