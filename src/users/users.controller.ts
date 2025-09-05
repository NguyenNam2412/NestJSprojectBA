// src/users/users.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@common/decorators/roles.decorators';
import { RolesGuard } from '@common/guards/roles.guard';
import { JwtAuthGuard } from '@auth/jwtAuthGuard.guard';
import { Role } from './role.enum';
// API endpoints for users
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // JwtAuthGuard confirms user is logged in, RolesGuard checks user role
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin) // only admin can access this route
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: UpdateUserDto): Promise<User> {
    return this.usersService.update(Number(id), user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(Number(id));
  }
}
