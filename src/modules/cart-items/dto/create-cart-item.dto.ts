import { PriceFormulaEnum } from '@common/enums/price-formula.enum';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  readonly eventId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly quantity: number;

  @IsNotEmpty()
  @IsEnum(PriceFormulaEnum)
  readonly priceFormula: PriceFormulaEnum;
}
