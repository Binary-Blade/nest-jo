import { Controller, Get, Post, Param, UseGuards, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UserId } from '@common/decorators/user-id.decorator';
import { AccessTokenGuard, RoleGuard } from '@security/guards';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/enums/user-role.enum';
import { PaginationAndFilterDto } from '@common/dto/pagination.dto';
import { Reservation } from './entities/reservation.entity';

/**
 * Controller to manage reservations.
 * @class
 */
@UseGuards(AccessTokenGuard)
@Controller('reservations')
export class ReservationsController {
  /**
   * Creates an instance of ReservationsController.
   *
   * @constructor
   * @param {ReservationsService} reservationsService - Service to manage reservations.
   */
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Creates reservations for a user based on their cart.
   *
   * @param {number} userId - ID of the user.
   * @param {number} cartId - ID of the user's cart.
   * @returns {Promise<Reservation[]>} - List of created reservations.
   *
   * @example
   * POST /reservations/1
   */
  @Post('/:cartId')
  async createReservations(
    @UserId() userId: number,
    @Param('cartId') cartId: number
  ): Promise<Reservation[]> {
    return this.reservationsService.generateReservation(userId, cartId);
  }

  /**
   * Retrieves all reservations for a user with pagination and filtering.
   *
   * @param {number} userId - ID of the user.
   * @param {PaginationAndFilterDto} paginationDto - DTO containing pagination and filter data.
   * @returns {Promise<{ reservations: Reservation[]; total: number }>} - The filtered reservations and total count.
   *
   * @example
   * GET /reservations/1/find-all?page=1&limit=10&sortBy=date&sortOrder=ASC
   */
  @Get(':userId/find-all')
  findAll(
    @Param('userId') userId: number,
    @Query() paginationDto: PaginationAndFilterDto
  ): Promise<{ reservations: Reservation[]; total: number }> {
    return this.reservationsService.findAll(userId, paginationDto);
  }

  /**
   * Retrieves all reservations with pagination for admin.
   *
   * @param {PaginationAndFilterDto} paginationDto - DTO containing pagination data.
   * @returns {Promise<Reservation[]>} - List of reservations.
   *
   * @example
   * GET /reservations/find-all-admin?page=1&limit=10
   */
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN)
  @Get('find-all-admin')
  findAllAdmin(@Query() paginationDto: PaginationAndFilterDto): Promise<Reservation[]> {
    return this.reservationsService.findAllAdmin(paginationDto);
  }

  /**
   * Retrieves all reservations for a user.
   *
   * @param {number} userId - ID of the user.
   * @returns {Promise<Reservation[]>} - List of reservations.
   *
   * @example
   * GET /reservations/find-all-data/1
   */
  @Get('find-all-data/:userId')
  findAllData(@Param('userId') userId: number): Promise<Reservation[]> {
    return this.reservationsService.findAllData(userId);
  }

  /**
   * Retrieves a single reservation by its ID.
   *
   * @param {string} id - ID of the reservation.
   * @param {number} userId - ID of the user.
   * @returns {Promise<Reservation>} - The found reservation.
   *
   * @example
   * GET /reservations/1
   */
  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: number): Promise<Reservation> {
    return this.reservationsService.findOne(+id, userId);
  }
}
