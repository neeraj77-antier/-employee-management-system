import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PerformanceService } from './performance.service';
import { EmployeesService } from '../employees/employees.service';
import {
  CreatePerformanceReviewDto,
  CreateGoalDto,
  UpdateGoalDto,
} from './dto/create-performance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('performance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PerformanceController {
  constructor(
    private readonly performanceService: PerformanceService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post('reviews')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  addReview(
    @Request() req,
    @Body() createReviewDto: CreatePerformanceReviewDto,
  ) {
    return this.performanceService.addReview(
      createReviewDto,
      req.user.employeeId,
    );
  }

  @Get('reviews/my')
  async getMyReviews(@Request() req) {
    const employee = await this.employeesService.findByUserId(req.user.userId);
    if (!employee) return [];
    return this.performanceService.getReviews(employee.id);
  }

  @Get('reviews')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getAllReviews(@Query('employeeId') employeeId?: number) {
    if (employeeId) {
      return this.performanceService.getReviews(employeeId);
    }
    return this.performanceService.getAllReviews();
  }

  @Post('goals')
  addGoal(@Request() req, @Body() createGoalDto: CreateGoalDto) {
    // Allowing employees to set their own goals, or managers to set goals for themselves
    return this.performanceService.addGoal(createGoalDto, req.user.employeeId);
  }

  @Get('goals')
  getMyGoals(@Request() req, @Query('employeeId') employeeId?: number) {
    // If admin/associate wants to see others' goals
    if (
      employeeId &&
      (req.user.role === UserRole.ADMIN || req.user.role === UserRole.MANAGER)
    ) {
      return this.performanceService.getGoals(employeeId);
    }
    return this.performanceService.getGoals(req.user.employeeId);
  }

  @Patch('goals/:id')
  updateGoal(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.performanceService.updateGoal(+id, updateGoalDto);
  }
}
