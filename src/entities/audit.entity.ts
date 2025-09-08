import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column({ length: 255 })
  action!: string;

  @Column({ type: 'json', nullable: true })
  details?: any;

  @Column({ name: 'ip_address', length: 45,  nullable: true })
  ipAddress?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
