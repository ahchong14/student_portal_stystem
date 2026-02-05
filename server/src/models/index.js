const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = require('./user')(sequelize);
const StudentProfile = require('./studentProfile')(sequelize);
const Course = require('./course')(sequelize);
const Term = require('./term')(sequelize);
const Enrollment = require('./enrollment')(sequelize);
const Grade = require('./grade')(sequelize);
const Notification = require('./notification')(sequelize);
const AuditLog = require('./auditLog')(sequelize);
const Payment = require('./payment')(sequelize);
const Document = require('./document')(sequelize);
const RefreshToken = require('./refreshToken')(sequelize);
const Waitlist = require('./waitlist')(sequelize);
const TranscriptRequest = require('./transcriptRequest')(sequelize);

User.hasOne(StudentProfile, { foreignKey: 'userId' });
StudentProfile.belongsTo(User, { foreignKey: 'userId' });

Term.hasMany(Course, { foreignKey: 'termId' });
Course.belongsTo(Term, { foreignKey: 'termId' });

User.hasMany(Enrollment, { foreignKey: 'userId' });
Course.hasMany(Enrollment, { foreignKey: 'courseId' });
Enrollment.belongsTo(User, { foreignKey: 'userId' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId' });

Enrollment.hasOne(Grade, { foreignKey: 'enrollmentId' });
Grade.belongsTo(Enrollment, { foreignKey: 'enrollmentId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Document, { foreignKey: 'userId' });
Document.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

Course.hasMany(Waitlist, { foreignKey: 'courseId' });
Waitlist.belongsTo(Course, { foreignKey: 'courseId' });
User.hasMany(Waitlist, { foreignKey: 'userId' });
Waitlist.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(TranscriptRequest, { foreignKey: 'userId' });
TranscriptRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  StudentProfile,
  Course,
  Term,
  Enrollment,
  Grade,
  Notification,
  AuditLog,
  Payment,
  Document,
  RefreshToken,
  Waitlist,
  TranscriptRequest
};
