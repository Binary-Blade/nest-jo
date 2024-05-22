import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user login.
 *
 * @class
 */
export class LoginDTO {
  /**
   * Email address of the user.
   * This field is required and must be a valid email address.
   * @type {string}
   * @isNotEmpty
   * @isEmail
   *
   * @example
   * const dto: LoginDTO = { email: 'john.doe@example.com', password: 'password123' };
   */
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  /**
   * Password of the user.
   * This field is required and must not be empty.
   * @type {string}
   * @isNotEmpty
   *
   * @example
   * const dto: LoginDTO = { email: 'john.doe@example.com', password: 'password123' };
   */
  @IsNotEmpty()
  readonly password: string;
}
