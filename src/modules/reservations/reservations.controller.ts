import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { UserId } from '@common/decorators/user-id.decorator';
import { AccessTokenGuard, RoleGuard } from '@security/guards';
import { PaymentService } from '@libs/payment/payment.service';
import { Role } from '@common/decorators/role.decorator';
import { UserRole } from '@common/enums/user-role.enum';

@UseGuards(AccessTokenGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly paymentService: PaymentService
  ) {}

  @Post('/:cardId')
  async processPayment(
    @UserId() userId: number,
    @Param('cardId')
    cardId: number
  ): Promise<{ status: string; detail: string }> {
    return this.paymentService.processPayment(userId, cardId);
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
