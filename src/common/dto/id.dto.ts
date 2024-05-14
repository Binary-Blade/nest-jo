import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class IdDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  readonly id: number;
}
