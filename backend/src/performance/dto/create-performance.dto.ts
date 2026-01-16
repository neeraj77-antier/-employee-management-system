import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  Min,
  Max,
  IsDateString,
} from 'class-validator';

export class CreatePerformanceReviewDto {
  @IsInt()
  @IsNotEmpty()
  employeeId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comments?: string;
}

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  deadline?: string;
}

export class UpdateGoalDto {
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
  @IsNotEmpty()
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}
