const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    channel: {
      type: DataTypes.ENUM('in_app', 'email', 'sms'),
      defaultValue: 'in_app'
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'notifications'
  });

  return Notification;
};
