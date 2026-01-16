import { IsNumber, IsString, IsEnum, IsOptional } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
  @IsNumber()
  employee_id!: number;

  @IsString()
  date!: string;

  @IsString()
  clock_in!: string;

  @IsOptional()
  @IsString()
  clock_out?: string;

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}
