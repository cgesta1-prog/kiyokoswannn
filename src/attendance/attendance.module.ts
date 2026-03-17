import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceHistory } from './attendance-history.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, AttendanceHistory])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}