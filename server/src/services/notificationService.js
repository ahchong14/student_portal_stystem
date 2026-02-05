const { Notification } = require('../models');
const { sendEmail } = require('./emailService');

const notifyUser = async ({ userId, email, message, channels = ['in_app'] }) => {
  const notifications = channels.map((channel) => ({
    userId,
    channel,
    message
  }));
  await Notification.bulkCreate(notifications);
  if (channels.includes('email') && email) {
    await sendEmail({ to: email, subject: 'Student Portal Notification', text: message });
  }
};

module.exports = { notifyUser };
