const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    termId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    instructor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeslot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    prerequisites: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
  }, {
    tableName: 'courses'
  });

  return Course;
};
