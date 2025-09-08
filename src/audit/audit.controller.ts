// src/audit/audit.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorators';
import { Role } from '@users/role.enum';

@Controller('audit')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles(Role.Admin) // admin only
  async findAll() {
    return this.auditService.findAll();
  }

  @Get('by-user')
  @Roles(Role.Admin)
  async findByUser(@Query('userId') userId: string) {
    return this.auditService.findByUser(userId);
  }
}
