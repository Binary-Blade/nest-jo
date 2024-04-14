import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AccessTokenGuard } from '@security/guards';
import { UserId } from '@common/decorators/user-id.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AccessTokenGuard)
  @Post('/:cardId')
  async processPayment(
    @UserId() userId: number,
    @Param('cardId')
    cardId: number
  ): Promise<{ status: string; detail: string }> {
    return this.paymentService.processPayment(userId, cardId);
  }
}
