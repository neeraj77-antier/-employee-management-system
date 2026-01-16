import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('performance_reviews')
export class PerformanceReview {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: Employee;

  @Column()
  reviewer_id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'date' })
  review_date: Date;
}
