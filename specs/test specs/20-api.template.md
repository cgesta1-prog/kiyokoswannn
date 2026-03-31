# API Design

## POST /attendance
Create new attendance record

Body:
- fullName
- email
- course
- yearLevel
- pcNumber
- roomNumber
- durationMinutes
- photo (optional)

Response:
- success message

---

## GET /attendance
Returns:
- current users
- attendance history

---

## GET /attendance/student/:name
Returns:
- student profile data