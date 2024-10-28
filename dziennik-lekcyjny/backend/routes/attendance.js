const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/dates/:kurs_id', authenticateToken, attendanceController.getAttendanceDatesByCourse);
router.get('/:kurs_id', authenticateToken, attendanceController.getAttendanceByCourse);
router.put('/update', authenticateToken, attendanceController.updateAttendanceStatus);
router.post('/add-today', authenticateToken, attendanceController.addAttendanceForToday);

module.exports = router;