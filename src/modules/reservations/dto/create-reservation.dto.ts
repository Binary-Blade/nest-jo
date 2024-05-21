import { User } from '@modules/users/entities/user.entity';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  user: User;

  @IsNotEmpty()
  @IsInt()
  cartItemId: number;

  @IsNotEmpty()
  totalPrice: number;

  @IsNotEmpty()
  @IsInt()
  paymentId: number;
}
