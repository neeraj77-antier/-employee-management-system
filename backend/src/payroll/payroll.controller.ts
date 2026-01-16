import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

import { EmployeesService } from '../employees/employees.service';

@Controller('payroll')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(
    private readonly payrollService: PayrollService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post('generate')
  @Roles(UserRole.ADMIN)
  generate(@Body() createPayrollDto: CreatePayrollDto) {
    return this.payrollService.generatePayroll(createPayrollDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Query('year') year?: number, @Query('month') month?: string) {
    return this.payrollService.findAll(year ? Number(year) : undefined, month);
  }

  @Get('my-slips')
  async getMySlips(@Request() req: any) {
    // robustly resolve employee from userId
    const employee = await this.employeesService.findByUserId(req.user.userId);
    if (!employee) {
      // If no employee record found for this user, return empty array
      return [];
    }
    return this.payrollService.findMySlips(employee.id);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.payrollService.findOne(+id);
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN)
  markAsPaid(@Param('id') id: string) {
    return this.payrollService.markAsPaid(+id);
  }
}
