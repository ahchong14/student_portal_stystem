const { User, StudentProfile, Term, Course } = require('../models');

const searchStudents = async (req, res) => {
  const { q } = req.query;
  const students = await User.findAll({ where: { role: 'Student' }, include: [StudentProfile] });
  const filtered = q
    ? students.filter((student) => student.email.includes(q) || (student.StudentProfile && student.StudentProfile.fullName.includes(q)))
    : students;
  return res.json(filtered);
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { contactNumber } = req.body;
  const profile = await StudentProfile.findOne({ where: { userId: id } });
  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }
  profile.contactNumber = contactNumber || profile.contactNumber;
  await profile.save();
  return res.json(profile);
};

const createTerm = async (req, res) => {
  const term = await Term.create(req.body);
  return res.status(201).json(term);
};

const createCourse = async (req, res) => {
  const course = await Course.create(req.body);
  return res.status(201).json(course);
};

module.exports = { searchStudents, updateStudent, createTerm, createCourse };
