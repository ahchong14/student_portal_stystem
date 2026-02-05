const { StudentProfile, User } = require('../models');

const getProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ where: { userId: req.user.id } });
  return res.json(profile);
};

const updateProfile = async (req, res) => {
  const { fullName, contactNumber, emergencyContactName, emergencyContactPhone, photoUrl } = req.body;
  const [profile] = await StudentProfile.findOrCreate({
    where: { userId: req.user.id },
    defaults: { fullName: fullName || 'Student', contactNumber, emergencyContactName, emergencyContactPhone, photoUrl }
  });
  profile.fullName = fullName || profile.fullName;
  profile.contactNumber = contactNumber || profile.contactNumber;
  profile.emergencyContactName = emergencyContactName || profile.emergencyContactName;
  profile.emergencyContactPhone = emergencyContactPhone || profile.emergencyContactPhone;
  profile.photoUrl = photoUrl || profile.photoUrl;
  await profile.save();
  return res.json(profile);
};

const switchRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.role = role;
  await user.save();
  return res.json({ message: 'Role updated', role: user.role });
};

module.exports = { getProfile, updateProfile, switchRole };
