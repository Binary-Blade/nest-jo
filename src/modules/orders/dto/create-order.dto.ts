import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { StatusReservation } from '@common/enums/status-reservation.enum';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  readonly reservationId?: number;

  @IsNotEmpty()
  @IsInt()
  readonly eventId?: number;

  @IsNotEmpty()
  @IsInt()
  readonly paymentId: number;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly totalPrice: number;

  @IsEnum(PriceFormulaEnum)
  readonly priceFormula: PriceFormulaEnum;

  @IsEnum(StatusReservation)
  readonly statusPayment: StatusReservation;
}
