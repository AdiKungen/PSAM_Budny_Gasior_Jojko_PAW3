const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, courseController.createCourse);
router.get('/', authenticateToken, courseController.getCourses);
router.get('/:id', authenticateToken, courseController.getCourseById);

module.exports = router;