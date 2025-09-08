import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './task.service';
import { JwtAuthGuard } from '@auth/jwt/jwtAuthGuard.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(
    @Body() dto: CreateTaskDto, 
    @Req() req: any,
  ) {
    return this.tasksService.createTask(dto, req.user);
  }

  @Get()
  getTasks(
    @Req() req: any,
  ) {
    return this.tasksService.getTasks(req.user);
  }

  @Put(':id')
  updateTask(
    @Param('id') id: number, 
    @Body() dto: UpdateTaskDto, 
    @Req() req: any,
  ) {
    return this.tasksService.updateTask(id, dto, req.user);
  }

  @Delete(':id')
  deleteTask(
    @Param('id') id: number, 
    @Req() req: any,
  ) {
    return this.tasksService.deleteTask(id, req.user);
  }
}
