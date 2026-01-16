import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  HALF_DAY = 'HALF_DAY',
}

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  clock_in: string;

  @Column({ type: 'time', nullable: true })
  clock_out: string;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status: AttendanceStatus;
}
