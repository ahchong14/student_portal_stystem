const { Course, Enrollment, Waitlist, Grade } = require('../models');
const { hasConflict } = require('../utils/timetable');
const { buildICal } = require('../utils/ical');

const listCourses = async (req, res) => {
  const courses = await Course.findAll();
  return res.json(courses);
};

const getCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  return res.json(course);
};

const addCourse = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  const existingEnrollments = await Enrollment.findAll({ where: { userId: req.user.id, status: 'enrolled' }, include: [Course] });
  const enrolledTimeslots = existingEnrollments.map((enrollment) => enrollment.Course.timeslot);
  if (hasConflict(enrolledTimeslots, course.timeslot)) {
    return res.status(400).json({ message: 'Schedule conflict detected' });
  }
  const totalCredits = existingEnrollments.reduce((sum, enrollment) => sum + enrollment.Course.credits, 0);
  if (totalCredits + course.credits > 18) {
    return res.status(400).json({ message: 'Credit limit exceeded' });
  }
  if (course.prerequisites.length > 0) {
    const completedGrades = await Grade.findAll({ where: { status: 'published' }, include: [{ model: Enrollment, where: { userId: req.user.id } }] });
    const completedCourses = completedGrades.map((grade) => grade.Enrollment.courseId);
    const hasPrereq = course.prerequisites.every((prereq) => completedCourses.includes(prereq));
    if (!hasPrereq) {
      return res.status(400).json({ message: 'Prerequisite not satisfied' });
    }
  }
  const currentEnrollments = await Enrollment.count({ where: { courseId: course.id, status: 'enrolled' } });
  if (currentEnrollments >= course.seats) {
    const waitlistCount = await Waitlist.count({ where: { courseId: course.id } });
    await Waitlist.create({ userId: req.user.id, courseId: course.id, position: waitlistCount + 1 });
    await Enrollment.create({ userId: req.user.id, courseId: course.id, status: 'waitlisted' });
    return res.json({ message: 'Added to waitlist' });
  }
  const enrollment = await Enrollment.create({ userId: req.user.id, courseId: course.id, status: 'enrolled' });
  return res.json({ message: 'Enrolled', enrollment });
};

const dropCourse = async (req, res) => {
  const enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId: req.params.id } });
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }
  enrollment.status = 'dropped';
  await enrollment.save();
  return res.json({ message: 'Dropped' });
};

const timetable = async (req, res) => {
  const enrollments = await Enrollment.findAll({ where: { userId: req.user.id, status: 'enrolled' }, include: [Course] });
  return res.json(enrollments.map((enrollment) => enrollment.Course));
};

const exportIcal = async (req, res) => {
  const enrollments = await Enrollment.findAll({ where: { userId: req.user.id, status: 'enrolled' }, include: [Course] });
  const ical = buildICal(enrollments.map((enrollment) => enrollment.Course));
  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="timetable.ics"');
  return res.send(ical);
};

module.exports = { listCourses, getCourse, addCourse, dropCourse, timetable, exportIcal };
