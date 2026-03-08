const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
  getDoctorAppointments,
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/', protect, restrictTo('patient'), bookAppointment);
router.get('/my', protect, restrictTo('patient'), getMyAppointments);
router.patch('/:id/cancel', protect, restrictTo('patient'), cancelAppointment);
router.get('/doctor/upcoming', protect, restrictTo('doctor'), getDoctorAppointments);

module.exports = router;
