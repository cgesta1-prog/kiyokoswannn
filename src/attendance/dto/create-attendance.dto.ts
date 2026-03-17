export class CreateAttendanceDto {
  fullName: string;
  email: string;
  course: string;
  yearLevel: number;
  pcNumber: number;
  roomNumber: string;
  durationMinutes: number;
  photo?: string;
}
