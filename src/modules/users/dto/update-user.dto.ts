import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object (DTO) for updating a user.
 * Extends CreateUserDto with all properties optional.
 *
 * @class
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
