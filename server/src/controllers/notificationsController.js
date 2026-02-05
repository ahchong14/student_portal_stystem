const { Notification } = require('../models');

const listNotifications = async (req, res) => {
  const notifications = await Notification.findAll({ where: { userId: req.user.id } });
  return res.json(notifications);
};

module.exports = { listNotifications };
