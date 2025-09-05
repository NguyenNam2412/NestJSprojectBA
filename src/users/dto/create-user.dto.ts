import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

// Data Transfer Object and validation for creating a user
export class CreateUserDto {
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}
