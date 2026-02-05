const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StudentProfile = sequelize.define('StudentProfile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergencyContactName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    emergencyContactPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'student_profiles'
  });

  return StudentProfile;
};
