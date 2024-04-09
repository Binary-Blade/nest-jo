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

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly firstName?: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  readonly lastName?: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;

  @IsOptional()
  readonly role?: UserRole;
}
