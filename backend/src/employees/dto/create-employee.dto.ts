import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsString()
  first_name!: string;

  @IsString()
  last_name!: string;

  @IsPhoneNumber()
  phone!: string;

  @IsNumber()
  department_id!: number;

  @IsString()
  designation!: string;

  @IsString()
  joining_date!: string;

  @IsNumber()
  salary!: number;

  @IsOptional()
  @IsNumber()
  manager_id?: number;

  // Optional fields for user creation
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  role?: string;
}
