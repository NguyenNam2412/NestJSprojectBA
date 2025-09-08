import { IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  action!: string;

  @IsOptional()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  ipAddress?: string;
}