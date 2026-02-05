const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const audit = require('../middleware/audit');
const authController = require('../controllers/authController');
const studentsController = require('../controllers/studentsController');
const coursesController = require('../controllers/coursesController');
const gradesController = require('../controllers/gradesController');
const financeController = require('../controllers/financeController');
const adminController = require('../controllers/adminController');
const notificationsController = require('../controllers/notificationsController');
const transcriptsController = require('../controllers/transcriptsController');
const documentsController = require('../controllers/documentsController');
const auditController = require('../controllers/auditController');
const healthController = require('../controllers/healthController');

const router = express.Router();

router.post('/auth/register', [body('email').isEmail(), body('password').isString()], authController.register);
router.post('/auth/verify', authController.verifyEmail);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/refresh', authController.refresh);
router.post('/auth/mfa/enable', auth, authController.enableMfa);
router.get('/auth/sso-stub', authController.ssoStub);

router.get('/students/profile', auth, studentsController.getProfile);
router.put('/students/profile', auth, audit('student_profile_update'), studentsController.updateProfile);
router.post('/students/role', auth, studentsController.switchRole);

router.get('/courses', auth, coursesController.listCourses);
router.get('/courses/:id', auth, coursesController.getCourse);
router.post('/courses/:id/add', auth, audit('course_add'), coursesController.addCourse);
router.post('/courses/:id/drop', auth, audit('course_drop'), coursesController.dropCourse);
router.get('/timetable', auth, coursesController.timetable);
router.get('/timetable/ical', auth, coursesController.exportIcal);

router.get('/grades', auth, gradesController.listGrades);
router.post('/grades/enter', auth, rbac(['Lecturer']), audit('grade_draft'), gradesController.enterGrade);
router.post('/grades/publish', auth, rbac(['Lecturer']), audit('grade_publish'), gradesController.publishGrade);

router.post('/transcripts', auth, audit('transcript_request'), transcriptsController.requestTranscript);
router.get('/transcripts', auth, transcriptsController.listTranscripts);

router.get('/finance/statement', auth, financeController.getStatement);
router.post('/finance/pay', auth, audit('payment_initiate'), financeController.initiatePayment);
router.post('/finance/webhook', financeController.paymentWebhook);

router.get('/notifications', auth, notificationsController.listNotifications);

router.get('/admin/students', auth, rbac(['Registrar', 'SystemAdmin']), adminController.searchStudents);
router.put('/admin/students/:id', auth, rbac(['Registrar', 'SystemAdmin']), audit('student_update'), adminController.updateStudent);
router.post('/admin/terms', auth, rbac(['Registrar', 'SystemAdmin']), audit('term_create'), adminController.createTerm);
router.post('/admin/courses', auth, rbac(['Registrar', 'SystemAdmin']), audit('course_create'), adminController.createCourse);

const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/documents', auth, upload.single('file'), documentsController.uploadDocument);
router.get('/documents', auth, documentsController.listDocuments);

router.get('/audit', auth, rbac(['SystemAdmin']), auditController.listAuditLogs);

router.get('/health', healthController.health);
router.get('/metrics', healthController.metrics);

module.exports = router;
