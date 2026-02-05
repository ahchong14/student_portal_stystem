const health = async (req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

const metrics = async (req, res) => {
  return res.type('text/plain').send('student_portal_requests_total 1');
};

module.exports = { health, metrics };
