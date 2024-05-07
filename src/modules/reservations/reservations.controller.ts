import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UserId } from '@common/decorators/user-id.decorator';
import { AccessTokenGuard, RoleGuard } from '@security/guards';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/enums/user-role.enum';

@UseGuards(AccessTokenGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  /**
   * Create a new reservation
   *
   * @param userId - The ID of the user making the reservation
   * @param cartId - The ID of the cart to create the reservation from
   * @returns - The created reservation
   * @throws ForbiddenException if the user is not authorized to create the reservation
   * @throws NotFoundException if the cart does not exist
   */
  @Post('/:cartId')
  async createReservations(
    @UserId() userId: number,
    @Param('cartId')
    cartId: number
  ) {
    return this.reservationsService.generateReservation(userId, cartId);
  }

  /**
   * Find all reservations for a user
   *
   * @param userId - The ID of the user to find reservations for
   * @returns - A list of reservations for the user
   * @throws NotFoundException if the user does not exist
   */
  @Get(':userId/find-all')
  findAll(@Param('userId') userId: number) {
    return this.reservationsService.findAll(userId);
  }

  /**
   * Find all reservations for an admin
   *
   * @returns - A list of all reservations
   * @throws ForbiddenException if the user is not an admin
   * @throws NotFoundException if the user does not exist
   */
  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN)
  @Get('find-all-admin')
  findAllAdmin() {
    return this.reservationsService.findAllAdmin();
  }

  /**
   * Find a single reservation by ID
   *
   * @param id - The ID of the reservation to find
   * @param userId - The ID of the user making the request
   * @returns - The requested reservation
   * @throws NotFoundException if the reservation does not exist
   * @throws ForbiddenException if the user is not authorized to access the reservation
   */
  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: number) {
    return this.reservationsService.findOne(+id, userId);
  }
}
