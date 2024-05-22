import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationsProcessorService } from './reservations-processor.service';
import { DEFAULT_PAGE_SIZE } from '@utils/constants/constants.common';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { QueryHelperService } from '@database/query/query-helper.service';

/**
 * Service to manage reservations.
 * @class
 */
@Injectable()
export class ReservationsService {
  /**
   * Creates an instance of ReservationsService.
   *
   * @constructor
   * @param {Repository<Reservation>} reservationRepository - Repository for the Reservation entity.
   * @param {ReservationsProcessorService} reservationProcessorService - Service for processing reservations.
   * @param {QueryHelperService} queryHelperService - Service for building query options.
   */
  constructor(
    @InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
    private readonly reservationProcessorService: ReservationsProcessorService,
    private readonly queryHelperService: QueryHelperService
  ) {}

  /**
   * Generates reservations for a user based on their cart.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the user's cart.
   * @returns {Promise<Reservation[]>} - List of created reservations.
   *
   * @example
   * const reservations = await reservationsService.generateReservation(1, 1);
   */
  async generateReservation(userId: number, cartId: number): Promise<Reservation[]> {
    return await this.reservationProcessorService.processUserReservation(userId, cartId);
  }

  /**
   * Retrieves all reservations for a user with pagination and filtering.
   *
   * @param {number} userId - ID of the user.
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination and filter data.
   * @returns {Promise<{ reservations: Reservation[]; total: number }>} - The filtered reservations and total count.
   *
   * @throws {InternalServerErrorException} If an error occurs while retrieving reservations.
   *
   * @example
   * const result = await reservationsService.findAll(1, paginationFilterDto);
   */
  async findAll(
    userId: number,
    paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ reservations: Reservation[]; total: number }> {
    const queryOptions =
      this.queryHelperService.buildQueryOptions<Reservation>(paginationFilterDto);

    queryOptions.where = { ...queryOptions.where, user: { userId } };
    queryOptions.relations = [
      'user',
      'reservationDetails',
      'reservationDetails.event',
      'transaction'
    ];
    queryOptions.select = this.getSelectFieldsFindAll();

    try {
      const [reservations, total] = await this.reservationRepository.findAndCount(queryOptions);
      return { reservations, total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve reservations.', error);
    }
  }

  /**
   * Retrieves all reservations for a user.
   *
   * @param {number} userId - ID of the user.
   * @returns {Promise<Reservation[]>} - List of reservations.
   *
   * @example
   * const reservations = await reservationsService.findAllData(1);
   */
  async findAllData(userId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { user: { userId } },
      relations: ['reservationDetails', 'reservationDetails.event', 'transaction'],
      select: this.getSelectFieldsFindAll()
    });
  }

  /**
   * Retrieves all reservations with pagination for admin.
   *
   * @param {PaginationAndFilterDto} paginationFilterDto - DTO containing pagination data.
   * @returns {Promise<Reservation[]>} - List of reservations.
   *
   * @throws {NotFoundException} If no reservations are found.
   *
   * @example
   * const reservations = await reservationsService.findAllAdmin(paginationFilterDto);
   */
  async findAllAdmin(paginationFilterDto: PaginationAndFilterDto): Promise<Reservation[]> {
    const { limit, offset } = paginationFilterDto;
    const reservations = await this.reservationRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
      relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
      select: this.getSelectFieldsFindAllAdmin()
    });

    if (!reservations.length) {
      throw new NotFoundException('No reservations found.');
    }

    return reservations;
  }

  /**
   * Finds a reservation by its ID and user ID.
   *
   * @param {number} reservationId - ID of the reservation.
   * @param {number} userId - ID of the user.
   * @returns {Promise<Reservation>} - The found reservation.
   *
   * @throws {NotFoundException} If the reservation is not found.
   *
   * @example
   * const reservation = await reservationsService.findOne(1, 1);
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
   * Saves a reservation to the repository.
   *
   * @param {Reservation} reservation - The reservation entity to save.
   * @returns {Promise<Reservation>} - The saved reservation.
   *
   * @example
   * const savedReservation = await reservationsService.saveReservation(reservation);
   */
  async saveReservation(reservation: Reservation): Promise<Reservation> {
    return await this.reservationRepository.save(reservation);
  }

  /**
   * Gets the fields to select for findAll query.
   *
   * @returns {object} - The fields to select.
   *
   * @private
   *
   * @example
   * const selectFields = reservationsService.getSelectFieldsFindAll();
   */
  private getSelectFieldsFindAll(): object {
    return {
      reservationId: true,
      reservationDetails: {
        title: true,
        shortDescription: true,
        price: true,
        priceFormula: true,
        event: {
          eventId: true,
          categoryType: true,
          startDate: true
        }
      },
      user: {
        userId: true,
        firstName: true,
        lastName: true
      },
      transaction: {
        statusPayment: true,
        paymentId: true
      }
    };
  }

  /**
   * Gets the fields to select for findAllAdmin query.
   *
   * @returns {object} - The fields to select for admin view.
   *
   * @private
   *
   * @example
   * const selectFields = reservationsService.getSelectFieldsFindAllAdmin();
   */
  private getSelectFieldsFindAllAdmin(): object {
    return {
      reservationId: true,
      user: {
        userId: true,
        email: true
      },
      reservationDetails: {
        title: true,
        event: {
          eventId: true
        }
      },
      transaction: {
        transactionId: true,
        statusPayment: true,
        paymentId: true,
        totalAmount: true
      }
    };
  }
}
