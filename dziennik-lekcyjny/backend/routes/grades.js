const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradesController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/forms', authenticateToken, gradeController.addForm);
router.post('/', authenticateToken, gradeController.addGrade);
router.put('/:id', authenticateToken, gradeController.updateGrade);
router.get('/average/:kurs_id/:uczen_id', authenticateToken, gradeController.getAverage);
router.get('/forms/:kurs_id', authenticateToken, gradeController.getFormsByCourse);
router.get('/course/:kurs_id', authenticateToken, gradeController.getGradesByCourse);

module.exports = router;