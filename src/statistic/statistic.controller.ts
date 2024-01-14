import { Controller, Get, Inject, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('statistic')
export class StatisticController {
  @Inject(StatisticService)
  private statisticService: StatisticService;

  @ApiOperation({ summary: '获取用户预定统计' })
  @Get('userBookingCount')
  async userBookingCount(
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime,
  ) {
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @ApiOperation({ summary: '获取时间范围预定数量统计' })
  @Get('meetingRoomUsedCount')
  async meetingRoomUsedCount(
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime,
  ) {
    return this.statisticService.meetingRoomUsedCount(startTime, endTime);
  }
}
