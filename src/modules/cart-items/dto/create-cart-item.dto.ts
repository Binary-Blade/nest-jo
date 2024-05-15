import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { IsEnum, IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  @IsNotEmpty()
  @IsInt()
  readonly eventId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  readonly quantity: number;

  @IsNotEmpty()
  @IsEnum(PriceFormulaEnum)
  readonly priceFormula: PriceFormulaEnum;
}
