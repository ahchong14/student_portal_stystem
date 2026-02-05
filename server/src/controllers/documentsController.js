const { Document } = require('../models');
const { saveFile } = require('../services/storageService');

const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const storagePath = saveFile(req.file);
  const document = await Document.create({
    userId: req.user.id,
    filename: req.file.originalname,
    storagePath,
    mimeType: req.file.mimetype,
    size: req.file.size,
    scanStatus: 'clean'
  });
  return res.status(201).json({ document, scanStatus: 'clean (mock scan)' });
};

const listDocuments = async (req, res) => {
  const documents = await Document.findAll({ where: { userId: req.user.id } });
  return res.json(documents);
};

module.exports = { uploadDocument, listDocuments };
