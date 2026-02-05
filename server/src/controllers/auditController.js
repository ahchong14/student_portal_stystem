const { AuditLog } = require('../models');

const listAuditLogs = async (req, res) => {
  const logs = await AuditLog.findAll({ order: [['createdAt', 'DESC']] });
  return res.json(logs);
};

module.exports = { listAuditLogs };
