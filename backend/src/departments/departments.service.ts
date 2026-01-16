import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

import { BadRequestException } from '@nestjs/common';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentsRepository.create(createDepartmentDto);
    return this.departmentsRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentsRepository.find();
  }

  async findOne(id: number): Promise<Department | null> {
    return this.departmentsRepository.findOneBy({ id });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentsRepository.update(id, updateDepartmentDto);
  }

  async remove(id: number) {
    const employeeCount = await this.employeesRepository.count({
      where: { department_id: id },
    });

    if (employeeCount > 0) {
      throw new BadRequestException(
        `Cannot delete department. There are ${employeeCount} employees assigned to it.`,
      );
    }

    return this.departmentsRepository.delete(id);
  }
}
