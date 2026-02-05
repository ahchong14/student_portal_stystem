const { AuditLog } = require('../models');

module.exports = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400) {
      try {
        await AuditLog.create({
          userId: req.user ? req.user.id : null,
          action,
          metadata: { path: req.originalUrl, method: req.method }
        });
      } catch (error) {
        console.error('Audit log error', error);
      }
    }
  });
  next();
};
