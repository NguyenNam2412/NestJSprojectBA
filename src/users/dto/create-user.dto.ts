import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '@users/role.enum'

// Data Transfer Object and validation for creating a user
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}

export class AdminCreateUserDto extends CreateUserDto {
  @IsEnum(Role)
  role!: Role;
}
