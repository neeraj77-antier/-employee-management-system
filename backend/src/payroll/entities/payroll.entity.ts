import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('payroll')
export class Payroll {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @Column({ length: 20 })
  month: string;

  @Column({ type: 'int' })
  year: number;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PAID'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'PAID';

  @Column({ type: 'date', nullable: true })
  payment_date: Date;

  @Column({ type: 'int', default: 30 })
  total_days: number;

  @Column({ type: 'int', default: 30 })
  present_days: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_salary: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  deductions: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  net_salary: number;

  @CreateDateColumn()
  generated_at: Date;
}
