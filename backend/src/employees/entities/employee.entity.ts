import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  user_id: number;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ length: 20 })
  phone: string;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ nullable: true })
  department_id: number;

  @Column({ length: 100 })
  designation: string;

  @Column({ type: 'date' })
  joining_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @ManyToOne(() => Employee, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'manager_id' })
  manager: Employee;

  @Column({ nullable: true })
  manager_id: number;
}
