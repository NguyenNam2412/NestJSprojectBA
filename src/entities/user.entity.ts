import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '@users/role.enum';
import { Task } from '@entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ 
    type: 'enum', 
    enum: Role, 
    default: Role.User,
   })
  role!: Role;

  @OneToMany(() => Task, (task) => task.owner)
  tasks!: Task[];
}
