import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

/**
 * Data transfer object for an ID.
 *
 * @export IdDto
 * @class IdDto
 * @property {number} id The ID
 */
export class IdDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  readonly id: number;
}
