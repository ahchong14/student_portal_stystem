const path = require('path');
const fs = require('fs');

const storageRoot = process.env.STORAGE_ROOT || path.join(__dirname, '../../uploads');

if (!fs.existsSync(storageRoot)) {
  fs.mkdirSync(storageRoot, { recursive: true });
}

const saveFile = (file) => {
  const target = path.join(storageRoot, `${Date.now()}-${file.originalname}`);
  fs.writeFileSync(target, file.buffer);
  return target;
};

module.exports = { saveFile, storageRoot };
