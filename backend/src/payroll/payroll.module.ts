import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { Payroll } from './entities/payroll.entity';
import { Employee } from '../employees/entities/employee.entity';

import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll, Employee]), EmployeesModule],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
