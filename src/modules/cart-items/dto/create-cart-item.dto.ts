import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  @IsInt()
  readonly eventId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly quantity: number;

  readonly type: string;
}
