import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { DepartmentsModule } from './departments/departments.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';
import { PayrollModule } from './payroll/payroll.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST', 'localhost');
        const port = parseInt(configService.get<string>('DB_PORT', '3306'), 10);
        const username = configService.get<string>('DB_USER');
        const database = configService.get<string>('DB_NAME');

        console.log(
          `Attempting DB Connection: Host=${host}, Port=${port}, User=${username}, DB=${database}`,
        );

        return {
          type: 'mysql',
          host,
          port,
          username,
          password: configService.get<string>('DB_PASSWORD'),
          database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Setting to true for dev/prototype velocity
          // IMPORTANT for Aiven
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    EmployeesModule,
    DepartmentsModule,
    AttendanceModule,
    LeavesModule,
    PayrollModule,
    PerformanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
