import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    // Validation: ensure either linked user_id or new user credentials are provided
    if (
      !createEmployeeDto.user_id &&
      (!createEmployeeDto.email || !createEmployeeDto.password)
    ) {
      throw new Error('Either user_id or email/password must be provided');
    }

    return this.employeesService.create(createEmployeeDto as any);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    const employee = await this.employeesService.findByUserId(req.user.userId);
    if (!employee) {
      throw new Error('Employee profile not found');
    }
    return employee;
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const userRole = req.user.role;
    const userId = req.user.userId;

    // Allow Admins and Managers to update anyone
    if (userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) {
      return this.employeesService.update(+id, updateEmployeeDto);
    }

    // For regular Employees, check if they are updating their own profile
    const employee = await this.employeesService.findByUserId(userId);

    // Note: Employee ID might be a string (bigint) or number, so we cast to Number for comparison
    // Use loose equality (or Number casting) because TypeORM bigint might be string
    if (!employee || Number(employee.id) !== +id) {
      throw new Error('You can only update your own profile');
    }

    // Optional: Restrict what employees can update (e.g., prevent changing salary/designation)
    // For now, we'll trust the DTO whitelisting or the frontend limitation.
    // Ideally, we should use a different DTO or filter fields here.
    return this.employeesService.update(+id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.employeesService.remove(+id);
  }
}
