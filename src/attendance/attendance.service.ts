import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceHistory } from './attendance-history.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,

    @InjectRepository(AttendanceHistory)
    private historyRepository: Repository<AttendanceHistory>,
  ) {}

async create(dto: CreateAttendanceDto) {

  // VALIDATION RULES
  if (dto.pcNumber < 1 || dto.pcNumber > 25) {
    throw new Error('PC number must be between 1 and 25.');
  }

  if (dto.yearLevel < 1 || dto.yearLevel > 4) {
    throw new Error('Year level must be between 1 and 4 only.');
  }

  if (dto.durationMinutes < 1 || dto.durationMinutes > 500) {
    throw new Error('Duration must be between 1 and 500 minutes.');
  }

  // CHECK IF PC IS OCCUPIED
  const existingPC = await this.attendanceRepository.findOne({
    where: {
      pcNumber: dto.pcNumber,
      roomNumber: dto.roomNumber,
    },
  });

  if (existingPC) {
    throw new Error(`PC ${dto.pcNumber} is already occupied.`);
  }

  const attendance = await this.attendanceRepository.save({
    ...dto,
    timeIn: new Date(),
  });

  return attendance;
}

  // CURRENT USERS (students currently using PCs)
  findAll() {
    return this.attendanceRepository.find();
  }

  // ATTENDANCE HISTORY
  findHistory() {
    return this.historyRepository.find({
      order: { timeOut: 'DESC' },
    });
  }

  // MOVE EXPIRED ATTENDANCES TO HISTORY
  async moveExpiredAttendances() {
  const now = new Date();

  const records = await this.attendanceRepository.find();

  for (const record of records) {

    if (!record.timeIn) continue; // skip if timeIn is missing

    const expireTime = new Date(record.timeIn);
    expireTime.setMinutes(expireTime.getMinutes() + record.durationMinutes);

    if (expireTime <= now) {
      await this.historyRepository.save({
        fullName: record.fullName,
        email: record.email,
        course: record.course,
        yearLevel: record.yearLevel,
        pcNumber: record.pcNumber,
        roomNumber: record.roomNumber,
        timeIn: record.timeIn,
        timeOut: now,
        durationMinutes: record.durationMinutes,
        photo: record.photo,
      });

      await this.attendanceRepository.delete(record.id);
    }
  }
}
}

