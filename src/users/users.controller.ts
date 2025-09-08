// src/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { CreateUserDto, AdminCreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@common/decorators/roles.decorators';
// import { RolesGuard } from '@common/guards/roles.guard';
import { JwtAuthGuard } from '@auth/jwt/jwtAuthGuard.guard';
import { Role } from './role.enum';

// API endpoints for users
@Controller('users')
@UseGuards(
  JwtAuthGuard, // JwtAuthGuard confirms user is logged in
  // RolesGuard // RolesGuard checks user role, RolesGuard can use for single controller or global in auth.module.ts
)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin) // only admin can access this route
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: number,
  ): Promise<User | null> {
    return this.usersService.findOne(Number(id));
  }

  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    return this.usersService.register(createUserDto);
  }

  @Post()
  @Roles(Role.Admin)
  create(
    @Body() createUserDto: AdminCreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  @Roles(Role.Admin) // only admin can delete user
  remove(
    @Param('id') id: number,
  ): Promise<User> {
    return this.usersService.remove(Number(id));
  }
}
