import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '@entities/audit.entity';
import { CreateAuditLogDto } from './dto/create-audit.dto';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async createLog(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditRepository.create(dto);
    return this.auditRepository.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}
