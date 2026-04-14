import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { LogMealDto } from './dto/log-meal.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/tracking')
export class TrackingController {
  constructor(private trackingService: TrackingService) {}

  @Post('log')
  @ApiOperation({ summary: 'Logger un repas' })
  logMeal(@CurrentUser('id') userId: string, @Body() dto: LogMealDto) {
    return this.trackingService.logMeal(userId, dto);
  }

  @Delete('log/:logId')
  @ApiOperation({ summary: 'Supprimer un log' })
  deleteMealLog(
    @CurrentUser('id') userId: string,
    @Param('logId') logId: string,
  ) {
    return this.trackingService.deleteMealLog(userId, logId);
  }

  @Get('daily')
  @ApiOperation({ summary: 'Dashboard journalier' })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  getDailyDashboard(
    @CurrentUser('id') userId: string,
    @Query('date') date?: string,
  ) {
    return this.trackingService.getDailyDashboard(userId, date);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Dashboard hebdomadaire' })
  getWeeklyDashboard(@CurrentUser('id') userId: string) {
    return this.trackingService.getWeeklyDashboard(userId);
  }
}
