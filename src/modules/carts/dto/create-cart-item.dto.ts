import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  readonly offerId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly quantity: number;
}
