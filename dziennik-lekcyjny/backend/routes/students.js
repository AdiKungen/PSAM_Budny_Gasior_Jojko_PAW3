const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, studentController.addStudent);
router.put('/:id', authenticateToken, studentController.updateStudent);
router.delete('/:id', authenticateToken, studentController.deleteStudent);
router.get('/', authenticateToken, studentController.getStudents);
router.get('/course/:kurs_id', authenticateToken, studentController.getStudentsByCourse);

module.exports = router;