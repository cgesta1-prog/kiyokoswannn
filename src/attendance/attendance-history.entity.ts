import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AttendanceHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  course: string;

  @Column()
  yearLevel: number;

  @Column()
  pcNumber: number;

  @Column()
  timeIn: Date;

  @Column()
  timeOut: Date;

  @Column()
roomNumber: string;
    
  @Column()
  durationMinutes: number;

  @Column({ nullable: true })
  photo: string;
}