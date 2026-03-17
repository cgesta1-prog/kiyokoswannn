import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {

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
  roomNumber: string;

  @Column()
  durationMinutes: number;

  @Column()
  timeIn: Date;

  @Column({ nullable: true })
  photo: string;

}