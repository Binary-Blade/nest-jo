import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

/**
 * Data transfer object for creating a reservation details.
 *
 * @export CreateReservationDetailsDto
 * @class CreateReservationDetailsDto
 * @property {number} reservationId The ID of the reservation
 * @property {number} eventId The ID of the event
 * @property {string} title The title of the reservation
 * @property {string} description The description of the reservation
 * @property {number} price The price of the reservation
 * @property {PriceFormulaEnum} priceFormula The price formula for the reservation
 */
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
