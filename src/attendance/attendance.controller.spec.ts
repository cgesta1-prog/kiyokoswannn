import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      AttendanceService,
      {
        provide: 'AttendanceRepository',
        useValue: {
          find: jest.fn(),
          save: jest.fn(),
        },
      },
      {
        provide: 'AttendanceHistoryRepository',
        useValue: {
          save: jest.fn(),
        },
      },
    ],
  }).compile();

  service = module.get<AttendanceService>(AttendanceService);
});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject duplicate PC number', async () => {
    const data = {
      fullName: 'Test Student',
      email: 'test@email.com',
      course: 'BSIT',
      yearLevel: 2,
      pcNumber: 5,
      roomNumber: 'Lab 1',
      durationMinutes: 60,
    };

    await service.create(data);

    await expect(service.create(data)).rejects.toThrow();
  });

  it('should reject invalid PC number > 25', async () => {
    const data = {
      fullName: 'Invalid PC',
      email: 'test2@email.com',
      course: 'BSIT',
      yearLevel: 2,
      pcNumber: 30,
      roomNumber: 'Lab 1',
      durationMinutes: 60,
    };

    await expect(service.create(data)).rejects.toThrow();
  });
});