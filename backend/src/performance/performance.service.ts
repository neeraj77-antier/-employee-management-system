import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerformanceReview } from './entities/performance.entity';
import { Goal } from './entities/goal.entity';
import {
  CreatePerformanceReviewDto,
  CreateGoalDto,
  UpdateGoalDto,
} from './dto/create-performance.dto';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(PerformanceReview)
    private reviewRepository: Repository<PerformanceReview>,
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async addReview(
    createReviewDto: CreatePerformanceReviewDto,
    reviewerId: number,
  ) {
    const { employeeId, rating, comments } = createReviewDto;

    // Using findOneBy for newer TypeORM versions or findOne with where
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const reviewer = await this.employeeRepository.findOne({
      where: { id: reviewerId },
    });
    if (!reviewer) throw new NotFoundException('Reviewer not found');

    const review = this.reviewRepository.create({
      employee,
      reviewer,
      employee_id: employeeId,
      reviewer_id: reviewerId,
      rating,
      comments,
      review_date: new Date(),
    });

    return this.reviewRepository.save(review);
  }

  async getReviews(employeeId: number) {
    return this.reviewRepository.find({
      where: { employee_id: employeeId },
      relations: ['reviewer', 'reviewer.user'],
      order: { review_date: 'DESC' },
    });
  }

  async getAllReviews() {
    return this.reviewRepository.find({
      relations: ['employee', 'employee.user', 'reviewer', 'reviewer.user'],
      order: { review_date: 'DESC' },
    });
  }

  async addGoal(createGoalDto: CreateGoalDto, employeeId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });
    if (!employee) throw new NotFoundException('Employee not found');

    const goal = this.goalRepository.create({
      ...createGoalDto,
      employee,
      employee_id: employeeId,
      status: 'PENDING',
    });

    return this.goalRepository.save(goal);
  }

  async getGoals(employeeId: number) {
    return this.goalRepository.find({
      where: { employee_id: employeeId },
      order: { created_at: 'DESC' },
    });
  }

  async updateGoal(id: number, updateGoalDto: UpdateGoalDto) {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');

    goal.status = updateGoalDto.status;
    return this.goalRepository.save(goal);
  }
}
