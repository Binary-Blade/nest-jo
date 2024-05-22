import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, Min } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a cart item.
 *
 * @class
 */
export class CreateCartItemDto {
  /**
   * Identifier for the user.
   * This field is optional and must be a non-empty integer if provided.
   * @type {number}
   * @isInt
   * @isOptional
   *
   * @example
   * const dto: CreateCartItemDto = { userId: 1, eventId: 2, quantity: 3, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsInt()
  @IsOptional()
  readonly userId: number;

  /**
   * Identifier for the event.
   * This field is required and must be a non-empty integer.
   * @type {number}
   * @isInt
   * @isNotEmpty
   *
   * @example
   * const dto: CreateCartItemDto = { userId: 1, eventId: 2, quantity: 3, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsInt()
  readonly eventId: number;

  /**
   * Quantity of the cart item.
   * This field is required, must be a non-empty positive integer, and must be at least 1.
   * @type {number}
   * @isInt
   * @isNotEmpty
   * @isPositive
   * @min 1
   *
   * @example
   * const dto: CreateCartItemDto = { userId: 1, eventId: 2, quantity: 3, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  readonly quantity: number;

  /**
   * Pricing formula for the cart item.
   * This field is required and must be a valid enum value of PriceFormulaEnum.
   * @type {PriceFormulaEnum}
   * @isNotEmpty
   * @isEnum
   *
   * @example
   * const dto: CreateCartItemDto = { userId: 1, eventId: 2, quantity: 3, priceFormula: PriceFormulaEnum.FIXED };
   */
  @IsNotEmpty()
  @IsEnum(PriceFormulaEnum)
  readonly priceFormula: PriceFormulaEnum;
}
