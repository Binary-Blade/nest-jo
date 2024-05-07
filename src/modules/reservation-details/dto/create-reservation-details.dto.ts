import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateReservationDetailsDto {
  @IsNotEmpty()
  @IsInt()
  readonly reservationId?: number;

  @IsNotEmpty()
  @IsInt()
  readonly eventId?: number;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsEnum(PriceFormulaEnum)
  readonly priceFormula: PriceFormulaEnum;
}
