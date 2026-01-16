import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';

export class CreatePayrollDto {
  @IsString()
  @IsNotEmpty()
  month: string;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;
}
