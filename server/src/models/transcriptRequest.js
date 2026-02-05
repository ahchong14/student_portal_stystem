const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TranscriptRequest = sequelize.define('TranscriptRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('requested', 'processing', 'completed'),
      defaultValue: 'requested'
    }
  }, {
    tableName: 'transcript_requests'
  });

  return TranscriptRequest;
};
