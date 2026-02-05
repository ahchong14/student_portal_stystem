const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Student', 'Lecturer', 'Registrar', 'Finance', 'SystemAdmin'),
      allowNull: false,
      defaultValue: 'Student'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    locale: {
      type: DataTypes.STRING,
      defaultValue: 'en'
    }
  }, {
    tableName: 'users'
  });

  return User;
};
