import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { PerformanceReview } from './entities/performance.entity';
import { Goal } from './entities/goal.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PerformanceReview, Goal, Employee]),
    EmployeesModule,
  ],
  controllers: [PerformanceController],
  providers: [PerformanceService],
})
export class PerformanceModule {}
