const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Waitlist = sequelize.define('Waitlist', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'waitlists'
  });

  return Waitlist;
};
