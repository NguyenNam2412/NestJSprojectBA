import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { Role } from '@users/role.enum'

// Data Transfer Object and validation for updating a user
export class UpdateUserDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  role?: Role;
}
