import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { User, UserRole } from '../users/entities/user.entity';

import { UsersService } from '../users/users.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private usersService: UsersService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    let newUser: User | null = null;

    try {
      // If auth fields are present, create User first
      if (createEmployeeDto.email && createEmployeeDto.password) {
        newUser = await this.usersService.create({
          email: createEmployeeDto.email,
          password: createEmployeeDto.password,
          role: (createEmployeeDto.role as any) || 'EMPLOYEE',
        });
        createEmployeeDto.user_id = newUser.id;
      }

      const employee = this.employeesRepository.create(createEmployeeDto);
      return await this.employeesRepository.save(employee);
    } catch (error) {
      // Rollback: If user was created but employee creation failed, delete the user
      if (newUser && newUser.id) {
        console.error(
          'Rolling back user creation due to employee creation failure:',
          error.message,
        );
        await this.usersService.remove(newUser.id); // Assuming generic remove exists or delete
      }
      throw error;
    }
  }

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({
      relations: ['user', 'department', 'manager'],
      where: {
        user: {
          role: Not(UserRole.ADMIN),
        },
      },
    });
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.employeesRepository.findOne({
      where: { id },
      relations: ['user', 'department', 'manager'],
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesRepository.update(id, updateEmployeeDto);
  }

  async remove(id: number) {
    return this.employeesRepository.delete(id);
  }

  async findByUserId(userId: number): Promise<Employee | null> {
    return this.employeesRepository.findOne({
      where: { user_id: userId },
      relations: ['user', 'department', 'manager'],
    });
  }
}
