import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Attendance E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Student submits attendance and appears in list', async () => {
    await request(app.getHttpServer())
      .post('/attendance')
      .send({
        fullName: 'Cedric Test',
        email: 'cedric@email.com',
        course: 'BSIT',
        yearLevel: 3,
        pcNumber: 15,
        roomNumber: 'Lab 2',
        durationMinutes: 120,
      });

    const res = await request(app.getHttpServer())
      .get('/attendance')
      .expect(200);

    expect(res.text).toContain('Cedric Test');
  });

  it('Student cannot use occupied PC', async () => {
    const data = {
      fullName: 'User1',
      email: 'user1@email.com',
      course: 'BSIT',
      yearLevel: 2,
      pcNumber: 20,
      roomNumber: 'Lab 1',
      durationMinutes: 60,
    };

    await request(app.getHttpServer()).post('/attendance').send(data);

    const res = await request(app.getHttpServer())
      .post('/attendance')
      .send({
        ...data,
        fullName: 'User2',
      });

    expect(res.status).toBe(400);
  });
});