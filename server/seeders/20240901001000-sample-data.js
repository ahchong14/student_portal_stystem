'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = async (password) => bcrypt.hash(password, 10);

    const users = [
      { id: uuidv4(), email: 'admin@example.edu', passwordHash: await passwordHash('AdminPass123!'), role: 'SystemAdmin', isVerified: true, mfaEnabled: false, locale: 'en', createdAt: now, updatedAt: now },
      { id: uuidv4(), email: 'registrar@example.edu', passwordHash: await passwordHash('Registrar123!'), role: 'Registrar', isVerified: true, mfaEnabled: false, locale: 'en', createdAt: now, updatedAt: now },
      { id: uuidv4(), email: 'lecturer@example.edu', passwordHash: await passwordHash('Lecturer123!'), role: 'Lecturer', isVerified: true, mfaEnabled: false, locale: 'en', createdAt: now, updatedAt: now },
      { id: uuidv4(), email: 'studentA@example.edu', passwordHash: await passwordHash('StudentA123!'), role: 'Student', isVerified: true, mfaEnabled: false, locale: 'en', createdAt: now, updatedAt: now },
      { id: uuidv4(), email: 'studentB@example.edu', passwordHash: await passwordHash('StudentB123!'), role: 'Student', isVerified: true, mfaEnabled: false, locale: 'en', createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('users', users);

    const profiles = [
      { id: uuidv4(), userId: users[3].id, fullName: 'Student A', contactNumber: '123456789', emergencyContactName: 'Parent A', emergencyContactPhone: '555-1000', createdAt: now, updatedAt: now },
      { id: uuidv4(), userId: users[4].id, fullName: 'Student B', contactNumber: '987654321', emergencyContactName: 'Parent B', emergencyContactPhone: '555-2000', createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('student_profiles', profiles);

    const termId = uuidv4();
    await queryInterface.bulkInsert('terms', [{ id: termId, name: 'Fall 2024', startDate: '2024-09-01', endDate: '2024-12-15', isActive: true, createdAt: now, updatedAt: now }]);

    const courseA = uuidv4();
    const courseB = uuidv4();
    const courseC = uuidv4();

    await queryInterface.bulkInsert('courses', [
      { id: courseA, termId, code: 'CS101', title: 'Intro to CS', credits: 3, instructor: 'Dr. Ada', timeslot: 'Mon 09:00-11:00', seats: 2, prerequisites: [], createdAt: now, updatedAt: now },
      { id: courseB, termId, code: 'CS201', title: 'Data Structures', credits: 3, instructor: 'Dr. Turing', timeslot: 'Tue 10:00-12:00', seats: 2, prerequisites: [courseA], createdAt: now, updatedAt: now },
      { id: courseC, termId, code: 'ENG101', title: 'Academic Writing', credits: 2, instructor: 'Prof. Lin', timeslot: 'Wed 09:00-10:30', seats: 2, prerequisites: [], createdAt: now, updatedAt: now }
    ]);

    await queryInterface.bulkInsert('enrollments', [
      { id: uuidv4(), userId: users[3].id, courseId: courseA, status: 'enrolled', createdAt: now, updatedAt: now }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('enrollments', null, {});
    await queryInterface.bulkDelete('courses', null, {});
    await queryInterface.bulkDelete('terms', null, {});
    await queryInterface.bulkDelete('student_profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
