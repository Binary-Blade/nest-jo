import { CategoryEventTypeEnum } from '@common/enums/category-type.enum';
import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating an event.
 *
 * @class
 */
export class CreateEventDto {
  /**
   * Title of the event.
   * This field is required, must be a string, and have a length between 5 and 50 characters.
   * @type {string}
   * @isNotEmpty
   * @isString
   * @minLength 5
   * @maxLength 25
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(25)
  readonly title: string;

  /**
   * Short description of the event.
   * This field is required, must be a string, and have a maximum length of 255 characters.
   * @type {string}
   * @isNotEmpty
   * @isString
   * @maxLength 255
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  readonly shortDescription: string;

  /**
   * Long description of the event.
   * This field is required, must be a string, and have a maximum length of 500 characters.
   * @type {string}
   * @isNotEmpty
   * @isString
   * @maxLength 500
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  readonly longDescription: string;

  /**
   * Base price of the event.
   * This field is required and must be a number.
   * @type {number}
   * @isNotEmpty
   * @isNumber
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsNumber()
  readonly basePrice: number;

  /**
   * Quantity of tickets available for the event.
   * This field is required and must be a number.
   * @type {number}
   * @isNotEmpty
   * @isNumber
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsNumber()
  readonly quantityAvailable: number;

  /**
   * Start date of the event in ISO 8601 format.
   * This field is required and must be a string.
   * @type {string}
   * @isNotEmpty
   * @isString
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsString()
  readonly startDate: string;

  /**
   * End date of the event in ISO 8601 format.
   * This field is required and must be a string.
   * @type {string}
   * @isNotEmpty
   * @isString
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsString()
  readonly endDate: string;

  /**
   * Category type of the event.
   * This field is required and must be a valid enum value of CategoryEventTypeEnum.
   * @type {CategoryEventTypeEnum}
   * @isNotEmpty
   * @isString
   *
   * @example
   * const dto: CreateEventDto = { title: 'Annual Tech Conference', shortDescription: 'A short description...', longDescription: 'A long description...', basePrice: 100, quantityAvailable: 500, startDate: '2024-06-01T10:00:00Z', endDate: '2024-06-01T18:00:00Z', categoryType: CategoryEventTypeEnum.CONFERENCE };
   */
  @IsNotEmpty()
  @IsString()
  readonly categoryType: CategoryEventTypeEnum;
}
