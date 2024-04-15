import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
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

  @Get('find-all')
  findAll() {
    return this.reservationsService.findAll();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
