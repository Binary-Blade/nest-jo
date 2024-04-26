import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UserId } from '@common/decorators/user-id.decorator';
import { AccessTokenGuard, RoleGuard } from '@security/guards';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/enums/user-role.enum';
import { Reservation } from './entities/reservation.entity';

@UseGuards(AccessTokenGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('/:cartId')
  async createReservations(
    @UserId() userId: number,
    @Param('cartId')
    cartId: number
  ): Promise<Reservation[]> {
    return this.reservationsService.createReservations(userId, cartId);
  }

  @Get(':userId/find-all')
  findAll(@Param('userId') userId: number) {
    return this.reservationsService.findAll(userId);
  }

  @UseGuards(RoleGuard)
  @Role(UserRole.ADMIN)
  @Get('find-all-admin')
  findAllAdmin() {
    return this.reservationsService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: number) {
    return this.reservationsService.findOne(+id, userId);
  }
}
