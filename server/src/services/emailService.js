const sendEmail = async ({ to, subject, text }) => {
  if (process.env.EMAIL_TRANSPORT === 'smtp') {
    console.log('SMTP transport not configured in this demo');
  }
  console.log(`[Email] To: ${to} | Subject: ${subject} | Text: ${text}`);
};

module.exports = { sendEmail };
