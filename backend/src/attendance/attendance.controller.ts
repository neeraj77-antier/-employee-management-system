import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { EmployeesService } from '../employees/employees.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post('check-in')
  async checkIn(@Request() req: any) {
    try {
      const employee = await this.employeesService.findByUserId(
        req.user.userId,
      );
      if (!employee) {
        throw new Error('Employee record not found for this user');
      }
      return await this.attendanceService.clockIn(employee.id);
    } catch (error) {
      console.error('Check-in error:', error);
      throw new HttpException(
        error.message || 'Failed to check in',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('check-out')
  async checkOut(@Request() req: any) {
    try {
      const employee = await this.employeesService.findByUserId(
        req.user.userId,
      );
      if (!employee) {
        throw new Error('Employee record not found for this user');
      }
      return await this.attendanceService.clockOut(employee.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getMyRecords(@Request() req: any) {
    const employee = await this.employeesService.findByUserId(req.user.userId);
    if (!employee) {
      return [];
    }
    return this.attendanceService.findByEmployee(employee.id);
  }

  @Get('employee/:id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getEmployeeRecords(@Param('id') id: string) {
    return this.attendanceService.findByEmployee(+id);
  }

  @Get('today')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getTodayAttendance() {
    return this.attendanceService.findToday();
  }

  @Get('all')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll() {
    return this.attendanceService.findAll();
  }
}
