import { statusReservation } from '@common/enums/status-reservation.enum';
import { User } from '@modules/users/entities/user.entity';
import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  cartItemId: number;

  @IsNotEmpty()
  status: statusReservation;

  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  paymentId: number;
}
