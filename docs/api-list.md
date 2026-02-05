# API List

Base URL: `/api`

## Auth
- POST `/auth/register`
- POST `/auth/verify`
- POST `/auth/login`
- POST `/auth/forgot-password`
- POST `/auth/refresh`
- GET `/auth/sso-stub`

## Students
- GET `/students/profile`
- PUT `/students/profile`
- POST `/students/role`

## Courses & Registration
- GET `/courses`
- GET `/courses/:id`
- POST `/courses/:id/add`
- POST `/courses/:id/drop`
- GET `/timetable`
- GET `/timetable/ical`

## Grades
- GET `/grades`
- POST `/grades/enter`
- POST `/grades/publish`

## Transcripts
- GET `/transcripts`
- POST `/transcripts`

## Finance
- GET `/finance/statement`
- POST `/finance/pay`
- POST `/finance/webhook`

## Notifications
- GET `/notifications`

## Admin
- GET `/admin/students`
- PUT `/admin/students/:id`
- POST `/admin/terms`
- POST `/admin/courses`

## Audit & Health
- GET `/audit`
- GET `/health`
- GET `/metrics`
