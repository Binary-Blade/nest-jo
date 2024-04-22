import { TypeEvent } from '@common/enums/type-event.enum';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * DTO for creating an event
 * @param title - The title of the event
 * @param description - The description of the event
 * @param price - The price of the event
 * @param quantityAvailable - The quantity of the event available
 * @param type - The type of the event
 * @returns - The created event
 */
export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly basePrice: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantityAvailable: number;
}
