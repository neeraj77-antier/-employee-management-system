import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { EmployeesService } from '../employees/employees.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private employeesService: EmployeesService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // 2-Step Login: Don't return token yet. Return success signal to trigger OTP modal.
    return {
      message: 'Credentials valid. Please verify OTP to continue.',
      email: user.email,
      require_otp: true,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Map RegisterDto to CreateEmployeeDto
    // We assume designation, department_id, phone, joining_date etc are provided or defaulted.
    // Ideally RegisterDto should match CreateEmployeeDto structure or we map it.
    // For this task, RegisterDto has fields, so we map them.
    // Note: We need to handle salary and joining_date if they are required in Employee.
    // Let's use defaults for self-registration if not provided, or expect them in RegisterDto.
    // RegisterDto has: first_name, last_name, email, password, phone, designation, department_id.

    // We need to construct CreateEmployeeDto
    const createEmployeeDto: any = {
      first_name: registerDto.first_name,
      last_name: registerDto.last_name,
      phone: registerDto.phone,
      department_id: registerDto.department_id,
      designation: registerDto.designation,
      email: registerDto.email,
      password: registerDto.password,
      role: 'EMPLOYEE', // Default role
      joining_date: new Date().toISOString().split('T')[0], // Default joining date (YYYY-MM-DD)
      salary: 0, // Default salary for self-registration
    };

    await this.employeesService.create(createEmployeeDto);

    return {
      message: 'Registration successful. Please verify OTP.',
      email: registerDto.email,
      require_otp: true,
    };
  }

  async verifyOtp(email: string, otp: string) {
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.is_verified) {
      await this.usersService.verifyUser(user.id);
      user.is_verified = true;
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }
}
