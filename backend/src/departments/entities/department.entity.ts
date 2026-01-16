import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
