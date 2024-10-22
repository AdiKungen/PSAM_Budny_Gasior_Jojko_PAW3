const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, attendanceController.markAttendance);
router.get('/history/:kurs_id/:uczen_id', authenticateToken, attendanceController.getAttendanceHistory);

module.exports = router;