import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

/**
 * Data Transfer Object (DTO) for updating a user's password.
 *
 * @class
 */
export class UpdatePasswordDTO {
  /**
   * The user's old password.
   * This field is required and must be a non-empty string.
   * @type {string}
   * @isNotEmpty
   * @isString
   *
   * @example
   * const dto: UpdatePasswordDTO = { oldPassword: 'OldPassword123!', newPassword: 'NewStrongPassword123!' };
   */
  @IsNotEmpty()
  @IsString()
  readonly oldPassword: string;

  /**
   * The user's new password.
   * This field is required and must be a strong password.
   * @type {string}
   * @isNotEmpty
   * @isStrongPassword
   *
   * @example
   * const dto: UpdatePasswordDTO = { oldPassword: 'OldPassword123!', newPassword: 'NewStrongPassword123!' };
   */
  @IsNotEmpty()
  @IsStrongPassword()
  readonly newPassword: string;
}
