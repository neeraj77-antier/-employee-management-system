import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private payrollRepository: Repository<Payroll>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async generatePayroll(createPayrollDto: CreatePayrollDto) {
    const { month, year } = createPayrollDto;

    // Check if payroll already exists for this period
    const existing = await this.payrollRepository.findOne({
      where: { month, year },
    });

    if (existing) {
      throw new BadRequestException(
        `Payroll for ${month} ${year} already exists`,
      );
    }

    const employees = await this.employeesRepository.find({
      relations: ['user'],
    });
    const payrolls: Payroll[] = [];

    for (const emp of employees) {
      const baseSalary = Number(emp.salary);
      const deductions = baseSalary * 0.15; // Mock 15% deductions (Tax + PF)
      const netSalary = baseSalary - deductions;

      const payroll = this.payrollRepository.create({
        employee: emp,
        employee_id: emp.id,
        month,
        year,
        base_salary: baseSalary,
        deductions: deductions,
        net_salary: netSalary,
        status: 'PENDING',
        total_days: 30, // Mock days
        present_days: 28, // Mock days
      });

      payrolls.push(payroll);
    }

    return this.payrollRepository.save(payrolls);
  }

  async findAll(year?: number, month?: string) {
    console.log('Finding all payroll params:', {
      year,
      month,
      typeYear: typeof year,
    });
    const query = this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.employee', 'employee');

    if (year) query.andWhere('payroll.year = :year', { year });
    if (month) query.andWhere('payroll.month = :month', { month });

    return query.getMany();
  }

  async findOne(id: number) {
    const payroll = await this.payrollRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!payroll) throw new NotFoundException('Payroll record not found');
    return payroll;
  }

  async findMySlips(employeeId: number) {
    return this.payrollRepository.find({
      where: { employee_id: employeeId },
      relations: ['employee'],
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  async markAsPaid(id: number) {
    const payroll = await this.findOne(id);
    payroll.status = 'PAID';
    payroll.payment_date = new Date();
    return this.payrollRepository.save(payroll);
  }
}
