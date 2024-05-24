import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a user.
 * Extends CreateUserDto with all properties optional.
 *
 * @class
 */
export class UpdateUserDto {
  /**
   * First name of the user.
   * This field is optional, must be a string, and have a length between 3 and 50 characters.
   * It should not contain any numbers or special characters other than hyphens.
   * @type {string}
   * @isString
   * @minLength 3
   * @maxLength 50
   * @matches /^[a-zA-Z-]+$/
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!' };
   */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z-]+$/, { message: 'firstName can only contain letters and hyphens' })
  readonly firstName?: string;

  /**
   * Last name of the user.
   * This field is optional, must be a string, and have a length between 3 and 50 characters.
   * It should not contain any numbers or special characters other than hyphens.
   * @type {string}
   * @isString
   * @minLength 3
   * @maxLength 50
   * @matches /^[a-zA-Z-]+$/
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!' };
   */
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z-]+$/, { message: 'lastName can only contain letters and hyphens' })
  readonly lastName?: string;

  /**
   * Email address of the user.
   * This field is required and must be a valid email address.
   * @type {string}
   * @isNotEmpty
   * @isEmail
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!' };
   */
  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
