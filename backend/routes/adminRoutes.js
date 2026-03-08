const express = require('express');
const router = express.Router();
const { getAllUsers, getAllAppointments, addDoctor, deleteDoctor } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/users', protect, restrictTo('admin'), getAllUsers);
router.get('/appointments', protect, restrictTo('admin'), getAllAppointments);
router.post('/doctors', protect, restrictTo('admin'), addDoctor);
router.delete('/doctors/:id', protect, restrictTo('admin'), deleteDoctor);

module.exports = router;
