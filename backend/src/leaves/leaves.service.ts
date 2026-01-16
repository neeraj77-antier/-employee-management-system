import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Leave, LeaveStatus } from './entities/leave.entity';
import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(Leave)
    private leavesRepository: Repository<Leave>,
  ) {}

  async create(createLeaveDto: CreateLeaveDto): Promise<Leave> {
    const leave = this.leavesRepository.create({
      ...createLeaveDto,
      status: LeaveStatus.PENDING,
    });
    return this.leavesRepository.save(leave);
  }

  async findAll(): Promise<Leave[]> {
    return this.leavesRepository.find({
      relations: ['employee', 'approver'],
      order: { id: 'DESC' },
    });
  }

  async findByEmployee(employeeId: number): Promise<Leave[]> {
    return this.leavesRepository.find({
      where: { employee_id: employeeId },
      relations: ['approver'],
      order: { id: 'DESC' },
    });
  }

  async findPending(): Promise<Leave[]> {
    return this.leavesRepository.find({
      where: { status: LeaveStatus.PENDING },
      relations: ['employee'],
      order: { id: 'DESC' },
    });
  }

  async approve(id: number, approverId: number, adminComments?: string) {
    return this.leavesRepository.update(id, {
      status: LeaveStatus.APPROVED,
      approved_by: approverId,
      admin_comments: adminComments,
    });
  }

  async reject(id: number, approverId: number, adminComments?: string) {
    return this.leavesRepository.update(id, {
      status: LeaveStatus.REJECTED,
      approved_by: approverId,
      admin_comments: adminComments,
    });
  }
}
