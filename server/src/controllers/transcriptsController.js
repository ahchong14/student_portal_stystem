const { TranscriptRequest } = require('../models');

const requestTranscript = async (req, res) => {
  const transcript = await TranscriptRequest.create({ userId: req.user.id, status: 'requested' });
  return res.status(201).json(transcript);
};

const listTranscripts = async (req, res) => {
  const transcripts = await TranscriptRequest.findAll({ where: { userId: req.user.id } });
  return res.json(transcripts);
};

module.exports = { requestTranscript, listTranscripts };
