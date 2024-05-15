import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Data transfer object for creating an event.
 *
 * @export CreateEventDto
 * @class CreateEventDto
 * @property {string} title The title of the event
 * @property {string} description The description of the event
 * @property {number} basePrice The base price of the event
 * @property {number} quantityAvailable The quantity of tickets available
 * @property {string} startDate The start date of the event
 * @property {string} endDate The end date of the event
 * @property {CategoryEventTypeEnum} categoryType The category type of the event
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
  readonly shortDescription: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  readonly longDescription: string;

  @IsNotEmpty()
  @IsNumber()
  readonly basePrice: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantityAvailable: number;

  @IsNotEmpty()
  @IsString()
  readonly startDate: string;

  @IsNotEmpty()
  @IsString()
  readonly endDate: string;

  @IsNotEmpty()
  @IsString()
  readonly categoryType: CategoryEventTypeEnum;
}
