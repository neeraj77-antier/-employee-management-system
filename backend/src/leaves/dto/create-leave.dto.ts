import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { LeaveType, LeaveSession } from '../entities/leave.entity';

export class CreateLeaveDto {
  @IsNumber()
  @IsOptional()
  employee_id!: number;

  @IsEnum(LeaveType)
  leave_type!: LeaveType;

  @IsEnum(LeaveSession)
  @IsOptional()
  session?: LeaveSession;

  @IsString()
  start_date!: string;

  @IsString()
  end_date!: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
