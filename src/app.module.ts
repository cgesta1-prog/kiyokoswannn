import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './attendance/attendance.entity';
import { AttendanceHistory } from './attendance/attendance-history.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'lab_attendance',
      entities: [Attendance, AttendanceHistory],
      synchronize: true,
    }),
    AttendanceModule,
  ],
})
export class AppModule {}