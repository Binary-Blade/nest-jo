import { User } from '@modules/users/entities/user.entity';
import { IsInt, IsNotEmpty, IsString, IsNumber } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a reservation.
 *
 * @class
 */
export class CreateReservationDto {
  /**
   * The user making the reservation.
   * This field is required and must be a valid User object.
   * @type {User}
   * @isNotEmpty
   * @isString
   *
   * @example
   * const dto: CreateReservationDto = { user: new User(), cartItemId: 1, totalPrice: 100.00, paymentId: 12345 };
   */
  @IsNotEmpty()
  @IsString()
  user: User;

  /**
   * Identifier for the cart item being reserved.
   * This field is required and must be a non-empty integer.
   * @type {number}
   * @isInt
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDto = { user: new User(), cartItemId: 1, totalPrice: 100.00, paymentId: 12345 };
   */
  @IsNotEmpty()
  @IsInt()
  cartItemId: number;

  /**
   * Total price of the reservation.
   * This field is required and must be a non-empty number.
   * @type {number}
   * @isNotEmpty
   * @isNumber
   *
   * @example
   * const dto: CreateReservationDto = { user: new User(), cartItemId: 1, totalPrice: 100.00, paymentId: 12345 };
   */
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  /**
   * Payment identifier for the reservation.
   * This field is required and must be a non-empty integer.
   * @type {number}
   * @isInt
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDto = { user: new User(), cartItemId: 1, totalPrice: 100.00, paymentId: 12345 };
   */
  @IsNotEmpty()
  @IsInt()
  paymentId: number;
}
