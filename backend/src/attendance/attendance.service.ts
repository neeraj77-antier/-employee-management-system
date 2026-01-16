import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async clockIn(employeeId: number): Promise<Attendance> {
    const today = new Date().toISOString().split('T')[0];

    // Check if already clocked in today
    const existing = await this.attendanceRepository.findOne({
      where: {
        employee_id: employeeId,
        date: new Date(today) as any,
      },
    });

    if (existing) {
      throw new Error('You have already clocked in for today.');
    }

    const now = new Date().toTimeString().split(' ')[0];

    const attendance = this.attendanceRepository.create({
      employee_id: employeeId,
      date: new Date(today),
      clock_in: now,
      status: AttendanceStatus.PRESENT,
    });

    return this.attendanceRepository.save(attendance);
  }

  async clockOut(employeeId: number): Promise<any> {
    const now = new Date().toTimeString().split(' ')[0];

    const attendance = await this.attendanceRepository.findOne({
      where: {
        employee_id: employeeId,
        clock_out: IsNull(),
      },
      order: {
        date: 'DESC',
        clock_in: 'DESC',
      },
    });

    if (!attendance) {
      throw new Error('No active check-in record found to check out from.');
    }

    attendance.clock_out = now;
    return this.attendanceRepository.save(attendance);
  }

  async findByEmployee(employeeId: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { employee_id: employeeId },
      order: { date: 'DESC' },
    });
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['employee'],
      order: { date: 'DESC' },
    });
  }

  async findToday(): Promise<Attendance[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.attendanceRepository.find({
      where: { date: new Date(today) as any },
      relations: ['employee'],
    });
  }
}
