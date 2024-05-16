import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationsProcessorService } from './reservations-processor.service';
import { DEFAULT_PAGE_SIZE } from '@utils/constants/constants.common';
import { PaginationAndFilterDto } from '@common/dto/pagination-filter.dto';

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
  async findAll(
    userId: number,
    paginationFilterDto: PaginationAndFilterDto
  ): Promise<{ reservations: Reservation[]; total: number }> {
    const {
      limit = DEFAULT_PAGE_SIZE.RESERVATION,
      offset = 0,
      sortBy,
      sortOrder = 'ASC',
      filterBy,
      filterValue
    } = paginationFilterDto;

    const whereCondition = this.buildWhereCondition(userId, filterBy, filterValue);

    const selectFields = this.getSelectFieldsFindAll();
    try {
      const [reservations, total] = await this.reservationRepository.findAndCount({
        where: whereCondition,
        relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
        select: selectFields,
        order: sortBy ? this.createNestedOrder(sortBy, sortOrder) : {},
        skip: offset,
        take: limit
      });

      return { reservations, total };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve reservations.', error);
    }
  }

  private buildWhereCondition(
    userId: number,
    filterBy?: string,
    filterValue?: string | number
  ): FindOptionsWhere<Reservation> {
    const whereCondition: FindOptionsWhere<Reservation> = { user: { userId } };

    if (filterBy && filterValue && filterValue !== 'ALL') {
      const nestedFields = filterBy.split('.');
      let currentField = whereCondition;
      nestedFields.forEach((field, index) => {
        if (index === nestedFields.length - 1) {
          currentField[field] = filterValue;
        } else {
          currentField[field] = {};
          currentField = currentField[field];
        }
      });
    }

    return whereCondition;
  }

  private createNestedOrder(sortBy: string, sortOrder: 'ASC' | 'DESC') {
    const orderParts = sortBy.split('.');
    const order = {};
    let currentPart = order;
    orderParts.forEach((part, index) => {
      if (index === orderParts.length - 1) {
        currentPart[part] = sortOrder;
      } else {
        currentPart[part] = {};
        currentPart = currentPart[part];
      }
    });
    return order;
  }

  /**
   * Find all reservations for an admin
   *
   * @returns - A list of all reservations
   * @throws ForbiddenException if the user is not an admin
   * @throws NotFoundException if the user does not exist
   */
  async findAllAdmin(paginationFilterDto: PaginationAndFilterDto): Promise<Reservation[]> {
    const { limit, offset } = paginationFilterDto;
    const reservations = await this.reservationRepository.find({
      skip: offset,
      take: limit ?? DEFAULT_PAGE_SIZE.USER,
      relations: ['user', 'reservationDetails', 'reservationDetails.event', 'transaction'],
      select: {
        reservationId: true,
        user: {
          userId: true,
          email: true // Example, adjust based on the fields you want to expose
        },
        reservationDetails: {
          title: true,
          event: {
            eventId: true
          }
        },
        transaction: {
          transactionId: true, // Assuming you want to include this as well
          statusPayment: true,
          paymentId: true,
          totalAmount: true // Example, adjust based on your schema
        }
      }
    });

    if (!reservations.length) {
      throw new NotFoundException('No reservations found.');
    }

    return reservations;
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

  private getSelectFieldsFindAll() {
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
}
