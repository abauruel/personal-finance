import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('stats')
  getStats(
    @GetUser('id') userId: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const parsedMonth = month ? Number.parseInt(month, 10) : undefined;
    const parsedYear = year ? Number.parseInt(year, 10) : undefined;

    return this.dashboardService.getStats(userId, parsedMonth, parsedYear);
  }
}
