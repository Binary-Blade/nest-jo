import { statusReservation } from '@common/enums/status-reservation.enum';
import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  cartItemId: number;

  @IsNotEmpty()
  status: statusReservation;

  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  paymentId: number;
}
