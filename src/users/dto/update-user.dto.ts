import { IsEmail, IsOptional, MinLength } from 'class-validator';

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
}
