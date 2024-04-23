import { TypeEvent } from '@common/enums/type-event.enum';
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
  @IsEnum(TypeEvent)
  readonly ticketType: TypeEvent;
}
