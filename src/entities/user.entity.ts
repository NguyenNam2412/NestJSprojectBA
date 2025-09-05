import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '@users/role.enum';

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
}
