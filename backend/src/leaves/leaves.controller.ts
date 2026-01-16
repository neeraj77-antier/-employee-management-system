import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

import { EmployeesService } from '../employees/employees.service';

@Controller('leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeavesController {
  constructor(
    private readonly leavesService: LeavesService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post()
  async create(@Body() createLeaveDto: CreateLeaveDto, @Request() req: any) {
    // If not provided in body (which it shouldn't be for self-request), use token
    if (!createLeaveDto.employee_id) {
      const employee = await this.employeesService.findByUserId(
        req.user.userId,
      );
      if (!employee) throw new Error('Employee record not found');
      createLeaveDto.employee_id = employee.id;
    }
    return this.leavesService.create(createLeaveDto);
  }

  @Get('my-requests')
  async getMyRequests(@Request() req: any) {
    const employee = await this.employeesService.findByUserId(req.user.userId);
    if (!employee) return [];
    return this.leavesService.findByEmployee(employee.id);
  }

  @Get('pending')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getPending() {
    return this.leavesService.findPending();
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async approve(
    @Param('id') id: string,
    @Request() req: any,
    @Body('reason') reason?: string,
  ) {
    const approver = await this.employeesService.findByUserId(req.user.userId);
    if (!approver) throw new Error('Approver not found');
    return this.leavesService.approve(+id, approver.id, reason);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async reject(
    @Param('id') id: string,
    @Request() req: any,
    @Body('reason') reason?: string,
  ) {
    const approver = await this.employeesService.findByUserId(req.user.userId);
    if (!approver) throw new Error('Approver not found');
    return this.leavesService.reject(+id, approver.id, reason);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll() {
    return this.leavesService.findAll();
  }
}
