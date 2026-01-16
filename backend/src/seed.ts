import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🌱 Seeding database...');

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const managerPassword = await bcrypt.hash('manager123', 10);
    const employeePassword = await bcrypt.hash('employee123', 10);

    // Insert departments
    await dataSource.query(`
      INSERT INTO departments (name, description) VALUES
      ('Engineering', 'Software development and technical operations'),
      ('Human Resources', 'Employee management and recruitment'),
      ('Sales', 'Business development and client relations'),
      ('Finance', 'Financial planning and accounting')
      ON DUPLICATE KEY UPDATE name=name;
    `);

    // Insert users
    await dataSource.query(`
      INSERT INTO users (email, password, role, is_active) VALUES
      ('admin@company.com', '${adminPassword}', 'ADMIN', true),
      ('manager@company.com', '${managerPassword}', 'MANAGER', true),
      ('employee@company.com', '${employeePassword}', 'EMPLOYEE', true)
      ON DUPLICATE KEY UPDATE email=email;
    `);

    // Get user IDs and department IDs
    const users = await dataSource.query('SELECT id, email FROM users');
    const departments = await dataSource.query(
      'SELECT id, name FROM departments',
    );

    const adminUser = users.find((u: any) => u.email === 'admin@company.com');
    const managerUser = users.find(
      (u: any) => u.email === 'manager@company.com',
    );
    const employeeUser = users.find(
      (u: any) => u.email === 'employee@company.com',
    );

    const engineeringDept = departments.find(
      (d: any) => d.name === 'Engineering',
    );
    const hrDept = departments.find((d: any) => d.name === 'Human Resources');

    // Insert employees
    if (adminUser && managerUser && employeeUser && engineeringDept && hrDept) {
      await dataSource.query(`
        INSERT INTO employees (user_id, first_name, last_name, phone, department_id, designation, joining_date, salary, manager_id) VALUES
        (${adminUser.id}, 'Admin', 'User', '+1234567890', ${hrDept.id}, 'System Administrator', '2020-01-01', 100000.00, NULL),
        (${managerUser.id}, 'Manager', 'User', '+1234567891', ${engineeringDept.id}, 'Engineering Manager', '2021-01-01', 80000.00, NULL),
        (${employeeUser.id}, 'Employee', 'User', '+1234567892', ${engineeringDept.id}, 'Software Engineer', '2022-01-01', 60000.00, ${managerUser.id})
        ON DUPLICATE KEY UPDATE user_id=user_id;
      `);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Default credentials:');
    console.log('Admin: admin@company.com / admin123');
    console.log('Manager: manager@company.com / manager123');
    console.log('Employee: employee@company.com / employee123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seed();
