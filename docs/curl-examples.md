# Curl Examples

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"studentA@example.edu","password":"StudentA123!"}'

# Verify email
curl -X POST http://localhost:4000/api/auth/verify \
  -H 'Content-Type: application/json' \
  -d '{"userId":"<USER_ID>"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"studentA@example.edu","password":"StudentA123!"}'

# List courses
curl -H 'Authorization: Bearer <TOKEN>' http://localhost:4000/api/courses

# Add course
curl -X POST -H 'Authorization: Bearer <TOKEN>' http://localhost:4000/api/courses/<COURSE_ID>/add

# Timetable
curl -H 'Authorization: Bearer <TOKEN>' http://localhost:4000/api/timetable
```
