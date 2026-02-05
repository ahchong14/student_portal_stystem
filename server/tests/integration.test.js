process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';

const request = require('supertest');
const app = require('../src/app');
const { sequelize, User, Course, Term } = require('../src/models');

const seedData = async () => {
  await sequelize.sync({ force: true });
  const term = await Term.create({ name: 'Test Term', startDate: '2024-09-01', endDate: '2024-12-01', isActive: true });
  const course = await Course.create({
    termId: term.id,
    code: 'TEST101',
    title: 'Test Course',
    credits: 3,
    instructor: 'Test Instructor',
    timeslot: 'Mon 09:00-11:00',
    seats: 5,
    prerequisites: []
  });
  return { course };
};

let course;

beforeAll(async () => {
  const seeded = await seedData();
  course = seeded.course;
});

afterAll(async () => {
  await sequelize.close();
});

test('student registers, verifies, enrolls, and views timetable', async () => {
  const registerRes = await request(app)
    .post('/api/auth/register')
    .send({ email: 'integration@student.edu', password: 'StrongPass1', role: 'Student' });

  expect(registerRes.status).toBe(201);
  const userId = registerRes.body.userId;

  const verifyRes = await request(app)
    .post('/api/auth/verify')
    .send({ userId });

  expect(verifyRes.status).toBe(200);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'integration@student.edu', password: 'StrongPass1' });

  expect(loginRes.status).toBe(200);
  const token = loginRes.body.accessToken;

  const addRes = await request(app)
    .post(`/api/courses/${course.id}/add`)
    .set('Authorization', `Bearer ${token}`)
    .send();

  expect(addRes.status).toBe(200);

  const timetableRes = await request(app)
    .get('/api/timetable')
    .set('Authorization', `Bearer ${token}`);

  expect(timetableRes.status).toBe(200);
  expect(timetableRes.body.length).toBe(1);
});
