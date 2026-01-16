import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('goals')
export class Goal {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @CreateDateColumn()
  created_at: Date;
}
