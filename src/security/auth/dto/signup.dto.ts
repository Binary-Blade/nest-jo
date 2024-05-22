import { UserRole } from '@common/enums/user-role.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
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
   * @type {string}
   * @isString
   * @minLength 3
   * @maxLength 50
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!' };
   */
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly firstName?: string;

  /**
   * Last name of the user.
   * This field is optional, must be a string, and have a length between 3 and 50 characters.
   * @type {string}
   * @isString
   * @minLength 3
   * @maxLength 50
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!' };
   */
  @IsString()
  @MinLength(3)
  @MaxLength(50)
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
  @IsEmail()
  readonly email: string;

  /**
   * Password for the user.
   * This field is required, must be a strong password, and have a minimum length of 6 characters.
   * @type {string}
   * @isNotEmpty
   * @isStrongPassword
   * @minLength 6
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!' };
   */
  @IsNotEmpty()
  @IsStrongPassword()
  @MinLength(6)
  readonly password: string;

  /**
   * Role of the user.
   * This field is optional and must be a valid enum value of UserRole.
   * @type {UserRole}
   * @isOptional
   *
   * @example
   * const dto: SignUpDto = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'StrongPassword123!', role: UserRole.ADMIN };
   */
  @IsOptional()
  readonly role?: UserRole;
}
