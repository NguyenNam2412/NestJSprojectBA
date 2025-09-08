import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '@entities/task.entity';
import { User } from '@entities/user.entity';
import { Role } from '@users/role.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async createTask(dto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.tasksRepository.create({ ...dto, owner: user });
    return this.tasksRepository.save(task);
  }

  async getTasks(user: User): Promise<Task[]> {
    if (user.role === Role.Admin) {
      return this.tasksRepository.find();
    }
    return this.tasksRepository.find({ where: { owner: { id: user.id } } });
  }

  async updateTask(id: number, dto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!task) throw new NotFoundException('Task not found');

    if (user.role !== Role.Admin && task.owner.id !== user.id) {
      throw new ForbiddenException('You cannot edit this task');
    }

    Object.assign(task, dto);
    return this.tasksRepository.save(task);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.tasksRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!task) throw new NotFoundException('Task not found');

    if (user.role !== Role.Admin && task.owner.id !== user.id) {
      throw new ForbiddenException('You cannot delete this task');
    }

    await this.tasksRepository.delete(id);
  }
}
