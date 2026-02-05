const { Enrollment, Course, Grade, User } = require('../models');
const { calculateGpa } = require('../utils/gpa');
const { notifyUser } = require('../services/notificationService');

const listGrades = async (req, res) => {
  const enrollments = await Enrollment.findAll({ where: { userId: req.user.id }, include: [Course, Grade] });
  const grades = enrollments.map((enrollment) => ({
    course: enrollment.Course,
    grade: enrollment.Grade ? enrollment.Grade.letter : null,
    status: enrollment.Grade ? enrollment.Grade.status : null
  }));
  const gpa = calculateGpa(grades.filter((item) => item.status === 'published').map((item) => item.grade));
  return res.json({ grades, gpa });
};

const enterGrade = async (req, res) => {
  const { enrollmentId, letter } = req.body;
  const enrollment = await Enrollment.findByPk(enrollmentId, { include: [User] });
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }
  const [grade] = await Grade.findOrCreate({ where: { enrollmentId }, defaults: { letter, status: 'draft' } });
  grade.letter = letter;
  grade.status = 'draft';
  await grade.save();
  return res.json({ message: 'Grade saved as draft', grade });
};

const publishGrade = async (req, res) => {
  const { enrollmentId } = req.body;
  const grade = await Grade.findOne({ where: { enrollmentId }, include: [{ model: Enrollment, include: [User] }] });
  if (!grade) {
    return res.status(404).json({ message: 'Grade not found' });
  }
  grade.status = 'published';
  await grade.save();
  await notifyUser({
    userId: grade.Enrollment.userId,
    email: grade.Enrollment.User.email,
    message: `Your grade for enrollment ${enrollmentId} was published.`
  });
  return res.json({ message: 'Grade published', grade });
};

module.exports = { listGrades, enterGrade, publishGrade };
