'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, primaryKey: true },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM('Student', 'Lecturer', 'Registrar', 'Finance', 'SystemAdmin'), allowNull: false },
      isVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      mfaEnabled: { type: Sequelize.BOOLEAN, defaultValue: false },
      locale: { type: Sequelize.STRING, defaultValue: 'en' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('student_profiles', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      fullName: { type: Sequelize.STRING, allowNull: false },
      contactNumber: { type: Sequelize.STRING },
      emergencyContactName: { type: Sequelize.STRING },
      emergencyContactPhone: { type: Sequelize.STRING },
      photoUrl: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('terms', {
      id: { type: Sequelize.UUID, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      startDate: { type: Sequelize.DATEONLY, allowNull: false },
      endDate: { type: Sequelize.DATEONLY, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('courses', {
      id: { type: Sequelize.UUID, primaryKey: true },
      termId: { type: Sequelize.UUID, allowNull: false },
      code: { type: Sequelize.STRING, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      credits: { type: Sequelize.INTEGER, allowNull: false },
      instructor: { type: Sequelize.STRING, allowNull: false },
      timeslot: { type: Sequelize.STRING, allowNull: false },
      seats: { type: Sequelize.INTEGER, allowNull: false },
      prerequisites: { type: Sequelize.JSON, defaultValue: [] },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('enrollments', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      courseId: { type: Sequelize.UUID, allowNull: false },
      status: { type: Sequelize.ENUM('enrolled', 'waitlisted', 'dropped'), defaultValue: 'enrolled' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('grades', {
      id: { type: Sequelize.UUID, primaryKey: true },
      enrollmentId: { type: Sequelize.UUID, allowNull: false },
      letter: { type: Sequelize.STRING },
      status: { type: Sequelize.ENUM('draft', 'published'), defaultValue: 'draft' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('notifications', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      channel: { type: Sequelize.ENUM('in_app', 'email', 'sms'), defaultValue: 'in_app' },
      message: { type: Sequelize.STRING, allowNull: false },
      readAt: { type: Sequelize.DATE },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID },
      action: { type: Sequelize.STRING, allowNull: false },
      metadata: { type: Sequelize.JSONB },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('payments', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, defaultValue: 'USD' },
      status: { type: Sequelize.ENUM('pending', 'paid', 'failed'), defaultValue: 'pending' },
      reference: { type: Sequelize.STRING, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('documents', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      filename: { type: Sequelize.STRING, allowNull: false },
      storagePath: { type: Sequelize.STRING, allowNull: false },
      mimeType: { type: Sequelize.STRING, allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      scanStatus: { type: Sequelize.ENUM('pending', 'clean', 'infected'), defaultValue: 'pending' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('refresh_tokens', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      token: { type: Sequelize.STRING, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.createTable('waitlists', {
      id: { type: Sequelize.UUID, primaryKey: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      courseId: { type: Sequelize.UUID, allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('transcript_requests');
    await queryInterface.dropTable('waitlists');
    await queryInterface.dropTable('refresh_tokens');
    await queryInterface.dropTable('documents');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('grades');
    await queryInterface.dropTable('enrollments');
    await queryInterface.dropTable('courses');
    await queryInterface.dropTable('terms');
    await queryInterface.dropTable('student_profiles');
    await queryInterface.dropTable('users');
  }
};
