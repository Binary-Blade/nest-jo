import { IsInt, IsPositive } from 'class-validator';

/**
 * Data Transfer Object (DTO) for validating an ID.
 * @class
 */
export class IdDto {
  /**
   * The ID to be validated.
   *
   * @type {number}
   * @readonly
   *
   * @example
   * const idDto = new IdDto();
   * idDto.id = 1;
   */
  @IsInt()
  @IsPositive()
  readonly id: number;
}
