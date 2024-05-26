import { UserRole } from '@common/enums/user-role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for user sign-up.
 *
 * @class
 */
export class SignUpDto {
  /**
   * First name of the user.
   * This field is optional, must be a string, and have a length between 3 and 50 characters.
   * It should not contain any numbers or special characters other than hyphens.
   * @type {string}
   * @IsString
   * @MinLength 3
   * @MaxLength 50
   * @Matches /^[a-zA-Z-]+$/
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John' };
   */
  @IsString()
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
   * const dto: SignUpDto = { lastName: 'Doe' };
   */
  @IsString()
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
   * const dto: SignUpDto = {  email: 'john.doe@example.com' };
   */
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  /**
   * Password for the user.
   * This field is required, must be a strong password, and have a minimum length of 6 characters.
   * @type {string}
   * @IsNotEmpty
   * @IsStrongPassword
   * @MinLength 6
   *
   * @example
   * const dto: SignUpDto = {  password: 'StrongPassword123!' };
   */
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(8)
  readonly password: string;

  /**
   * Role of the user.
   * This field is optional and must be a valid enum value of UserRole.
   * @type {UserRole}
   * @IsOptional
   *
   * @example
   * const dto: SignUpDto = {  role: UserRole.ADMIN };
   */
  @IsOptional()
  readonly role?: UserRole;
}
