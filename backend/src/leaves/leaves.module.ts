import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
import { Leave } from './entities/leave.entity';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Leave]), EmployeesModule],
  controllers: [LeavesController],
  providers: [LeavesService],
})
export class LeavesModule {}
