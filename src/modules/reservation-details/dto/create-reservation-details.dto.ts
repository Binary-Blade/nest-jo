import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating reservation details.
 *
 * @class
 */
export class CreateReservationDetailsDto {
  /**
   * Identifier for the reservation.
   * This field is optional and must be a non-empty integer if provided.
   * @type {number}
   * @isInt
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDetailsDto = { reservationId: 1, eventId: 2, title: 'Concert', shortDescription: 'Live concert event', price: 50.00, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsInt()
  readonly reservationId?: number;

  /**
   * Identifier for the event.
   * This field is optional and must be a non-empty integer if provided.
   * @type {number}
   * @isInt
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDetailsDto = { reservationId: 1, eventId: 2, title: 'Concert', shortDescription: 'Live concert event', price: 50.00, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsInt()
  readonly eventId?: number;

  /**
   * Title of the reservation details.
   * This field is required and must be a non-empty string.
   * @type {string}
   * @isString
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDetailsDto = { reservationId: 1, eventId: 2, title: 'Concert', shortDescription: 'Live concert event', price: 50.00, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  /**
   * Short description of the reservation details.
   * This field is required and must be a non-empty string.
   * @type {string}
   * @isString
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDetailsDto = { reservationId: 1, eventId: 2, title: 'Concert', shortDescription: 'Live concert event', price: 50.00, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsString()
  readonly shortDescription: string;

  /**
   * Price of the reservation.
   * This field is required, must be a number, and must be at least 0.
   * @type {number}
   * @isNumber
   * @min 0
   * @isNotEmpty
   *
   * @example
   * const dto: CreateReservationDetailsDto = { reservationId: 1, eventId: 2, title: 'Concert', shortDescription: 'Live concert event', price: 50.00, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price: number;

  /**
   * Pricing formula for the reservation.
   * This field is required and must be a valid enum value of PriceFormulaEnum.
   * @type {PriceFormulaEnum}
   * @isEnum
   *
   * @example
   * const dto: CreateReservationDetailsDto = { reservationId: 1, eventId: 2, title: 'Concert', shortDescription: 'Live concert event', price: 50.00, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsEnum(PriceFormulaEnum)
  readonly priceFormula: PriceFormulaEnum;
}
