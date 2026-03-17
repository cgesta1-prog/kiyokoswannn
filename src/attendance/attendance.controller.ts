import { Controller, Get, Post, Body, Res, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import type { Response } from 'express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('attendance')
export class AttendanceController {

constructor(private readonly attendanceService: AttendanceService) {}



/* =========================================
   STUDENT PROFILE PAGE
========================================= */
@Get('student/:name')
async studentProfile(@Param('name') name: string, @Res() res: Response) {

  const decodedName = decodeURIComponent(name);

  const current = await this.attendanceService.findAll();
  const history = await this.attendanceService.findHistory();

  const student =
    current.find(s => s.fullName === decodedName) ||
    history.find(s => s.fullName === decodedName);

  if (!student) {
    return res.send(`<h2>Student not found</h2>`);
  }

let avatar;

if (student.photo) {
  avatar = `<img src="/uploads/${student.photo}" class="avatar">`;
} else {
  const letter = student.fullName.charAt(0).toUpperCase();
  avatar = `<div class="avatar-letter">${letter}</div>`;
}

res.send(`
<html>
<head>
<title>Student Profile</title>

<style>

body{
  font-family: Arial;
  background:#eef5ef;
  padding:40px;
  display:flex;
  justify-content:center;
}

.card{
  width:420px;
  background:white;
  padding:25px;
  border-radius:10px;
  box-shadow:0 4px 10px rgba(0,0,0,0.1);
  text-align:center;
}

.avatar{
  width:130px;
  height:130px;
  border-radius:50%;
  border:5px solid #66bb6a;
  object-fit:cover;
  margin-bottom:15px;
}

.avatar-letter{
  width:130px;
  height:130px;
  border-radius:50%;
  border:5px solid #66bb6a;
  background:#c8e6c9;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:48px;
  font-weight:bold;
  color:#2e7d32;
  margin:0 auto 15px auto;
}

h2{
  color:#2e7d32;
}

.row{
  margin:10px 0;
  font-size:16px;
}

.label{
  font-weight:bold;
}

a{
  display:inline-block;
  margin-top:20px;
  text-decoration:none;
  background:#4caf50;
  color:white;
  padding:10px 15px;
  border-radius:6px;
}

</style>

</head>

<body>

<div class="card">

${avatar}

<h2>Student Profile Card</h2>

<div class="row"><span class="label">Name:</span> ${student.fullName}</div>
<div class="row"><span class="label">Email:</span> ${student.email}</div>
<div class="row"><span class="label">Course & Section:</span> ${student.course}</div>
<div class="row"><span class="label">Year Level:</span> ${student.yearLevel}</div>
<div class="row"><span class="label">PC Number:</span> ${student.pcNumber}</div>
<div class="row"><span class="label">Room:</span> ${student.roomNumber}</div>
<div class="row"><span class="label">Duration:</span> ${student.durationMinutes} minutes</div>

<a href="/attendance/admin">Back</a>

</div>

</body>
</html>
`);
}



/* =========================================
   STUDENT INPUT PAGE
========================================= */
@Get('student')
async studentForm(@Res() res: Response) {

res.send(`
<html>
<head>
<title>Student Attendance</title>

<style>

body{
font-family:Arial;
background:#e8f5e9;
padding:40px;
display:flex;
justify-content:center;
}

form{
background:white;
padding:25px;
border-radius:10px;
box-shadow:0 4px 10px rgba(0,0,0,0.1);
display:flex;
flex-direction:column;
gap:12px;
width:350px;
}

input{
padding:10px;
border:1px solid #a5d6a7;
border-radius:5px;
}

button{
background:#66bb6a;
color:white;
border:none;
padding:12px;
border-radius:6px;
cursor:pointer;
font-weight:bold;
}

</style>

</head>

<body>

<form method="POST" action="/attendance" enctype="multipart/form-data">

<h2>Computer Lab Attendance</h2>

<input type="email" name="email" placeholder="Email" required/>

<input type="text" name="fullName" placeholder="Full Name" required/>

<input type="text" name="course" placeholder="Course & Section" required/>

<input type="number" placeholder="Year Level" name="yearLevel" min="1" max="4" required/>

<input type="number" placeholder="PC Number" name="pcNumber" min="1" max="25" required/>

<input type="text" name="roomNumber" placeholder="Room Number" required/>

<input type="number" placeholder="Duration Minutes" name="durationMinutes" min="1" max="500" required/>

<input type="file" name="photo" accept="image/*">

<button type="submit">Submit Attendance</button>

</form>

</body>
</html>
`);
}



/* =========================================
   TEACHER DASHBOARD
========================================= */
@Get('admin')
async adminDashboard(@Res() res: Response) {

await this.attendanceService.moveExpiredAttendances();

const currentUsers = await this.attendanceService.findAll();
const totalPCs = 25;

const pcGrid = Array.from({ length: totalPCs }, (_, i) => {
  const pcNumber = i + 1;

  const user = currentUsers.find(u => u.pcNumber === pcNumber);

  if (user) {
    return `
      <div class="pc used">
        <div>PC ${pcNumber}</div>
        <small>${user.fullName}</small>
      </div>
    `;
  }

  return `
    <div class="pc free">
      <div>PC ${pcNumber}</div>
      <small>Available</small>
    </div>
  `;
}).join('');
const history = await this.attendanceService.findHistory();

const currentRows = currentUsers.map(a => `
<tr>
<td><a href="/attendance/student/${encodeURIComponent(a.fullName)}">${a.fullName}</a></td>
<td>${a.email}</td>
<td>${a.course}</td>
<td>${a.yearLevel}</td>
<td>${a.pcNumber}</td>
<td>${a.roomNumber}</td>
<td>${a.durationMinutes}</td>
<td>${a.timeIn ? new Date(a.timeIn).toLocaleString() : ''}</td>
</tr>
`).join('');

const historyRows = history.map(h => `
<tr>
<td><a href="/attendance/student/${encodeURIComponent(h.fullName)}">${h.fullName}</a></td>
<td>${h.email}</td>
<td>${h.course}</td>
<td>${h.yearLevel}</td>
<td>${h.pcNumber}</td>
<td>${h.roomNumber}</td>
<td>${h.durationMinutes}</td>
<td>${h.timeIn ? new Date(h.timeIn).toLocaleString() : ''}</td>
<td>${h.timeOut ? new Date(h.timeOut).toLocaleString() : ''}</td>
</tr>
`).join('');

res.send(`
<html>
<head>
<title>Teacher Dashboard</title>

<style>

body{
  font-family: Arial, Helvetica, sans-serif;
  background:#e8f5e9;
  padding:40px;
  display:flex;
  justify-content:center;
}

/* MAIN CONTAINER */
.container{
  width:1000px;
}

/* CARD STYLE (same as student) */
.card{
  background:white;
  padding:25px;
  border-radius:10px;
  box-shadow:0 4px 10px rgba(0,0,0,0.1);
  margin-bottom:30px;
}

/* TITLES */
h1{
  color:#2e7d32;
  text-align:center;
  margin-bottom:30px;
}

h2{
  color:#2e7d32;
  margin-bottom:10px;
}

/* TABLE */
table{
  width:100%;
  border-collapse:collapse;
}

th{
  background:#66bb6a;
  color:white;
  padding:10px;
}

td{
  padding:10px;
  border-bottom:1px solid #c8e6c9;
}

tr:nth-child(even){
  background:#f1f8f4;
}

/* LINKS */
a{
  text-decoration:none;
  color:#2e7d32;
  font-weight:bold;
}

a:hover{
  text-decoration:underline;
}

/* PC GRID */
.pc-grid{
  display:grid;
  grid-template-columns: repeat(5, 1fr);
  gap:15px;
  margin-top:10px;
}

/* PC BOX */
.pc{
  padding:15px;
  border-radius:10px;
  text-align:center;
  font-weight:bold;
  box-shadow:0 2px 5px rgba(0,0,0,0.1);
}

/* AVAILABLE PC */
.pc.free{
  background:#c8e6c9;
  color:#1b5e20;
}

/* OCCUPIED PC */
.pc.used{
  background:#ffcdd2;
  color:#b71c1c;
}

.pc small{
  display:block;
  margin-top:5px;
  font-weight:normal;
}

</style>

</head>

<body>

<div class="container">

<h1>Computer Laboratory Dashboard</h1>

<div class="card">

<h2>Currently Using PCs</h2>
<div class="card">

<h2>Laboratory PC Monitor</h2>

<div class="pc-grid">

${pcGrid}

</div>

</div>
<table>
<tr>
<th>Name</th>
<th>Email</th>
<th>Course</th>
<th>Year</th>
<th>PC</th>
<th>Room</th>
<th>Minutes</th>
<th>Time In</th>
</tr>

${currentRows}

</table>

</div>

<div class="card">

<h2>Attendance History</h2>

<table>
<tr>
<th>Name</th>
<th>Email</th>
<th>Course</th>
<th>Year</th>
<th>PC</th>
<th>Room</th>
<th>Minutes</th>
<th>Time In</th>
<th>Time Out</th>
</tr>

${historyRows}

</table>

</div>

</div>

</body>
</html>
`);
}



/* =========================================
   CREATE ATTENDANCE
========================================= */
@Post()
@UseInterceptors(FileInterceptor('photo', { dest: './uploads' }))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() body: any,
  @Res() res: Response,
) {

  try {

    await this.attendanceService.create({
      fullName: body.fullName,
      email: body.email,
      course: body.course,
      yearLevel: Number(body.yearLevel),
      pcNumber: Number(body.pcNumber),
      roomNumber: body.roomNumber,
      durationMinutes: Number(body.durationMinutes),
      photo: file ? file.filename : undefined,
    });

    // SUCCESS PAGE
    res.send(`
    <html>
    <head>
    <title>Success</title>

    <style>
    body{
      font-family: Arial;
      background:#e8f5e9;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }

    .card{
      background:white;
      padding:30px;
      border-radius:10px;
      box-shadow:0 4px 10px rgba(0,0,0,0.1);
      text-align:center;
      width:350px;
    }

    h2{
      color:#2e7d32;
    }

    p{
      margin:15px 0;
    }

    a{
      text-decoration:none;
      background:#66bb6a;
      color:white;
      padding:10px 18px;
      border-radius:6px;
      font-weight:bold;
    }

    a:hover{
      background:#43a047;
    }
    </style>

    </head>

    <body>

    <div class="card">

    <h2>✅ Attendance Recorded</h2>

    <p>Your attendance has been successfully submitted.</p>

    <a href="/attendance/student">Submit Another</a>

    </div>

    </body>
    </html>
    `);

  } catch (error) {

    // YOUR EXISTING ERROR PAGE (keep styled one)
    res.send(`
    <html>
    <head>
    <title>Error</title>

    <style>
    body{
      font-family: Arial;
      background:#e8f5e9;
      display:flex;
      justify-content:center;
      align-items:center;
      height:100vh;
    }

    .card{
      background:white;
      padding:30px;
      border-radius:10px;
      box-shadow:0 4px 10px rgba(0,0,0,0.1);
      width:350px;
      text-align:center;
    }

    h2{
      color:#c62828;
    }

    a{
      text-decoration:none;
      background:#66bb6a;
      color:white;
      padding:10px 18px;
      border-radius:6px;
    }
    </style>

    </head>

    <body>

    <div class="card">

    <h2>Error</h2>
    <p>${error.message}</p>

    <a href="/attendance/student">Back</a>

    </div>

    </body>
    </html>
    `);
  }
}

}

