import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

export enum LeaveType {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  PAID = 'PAID',
  SHORT = 'SHORT',
}

export enum LeaveSession {
  FIRST_HALF = 'FIRST_HALF',
  SECOND_HALF = 'SECOND_HALF',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('leave_requests')
export class Leave {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @Column({ type: 'enum', enum: LeaveType })
  leave_type: LeaveType;

  @Column({ type: 'enum', enum: LeaveSession, nullable: true })
  session: LeaveSession;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'approved_by' })
  approver: Employee;

  @Column({ nullable: true })
  approved_by: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  admin_comments: string;
}
