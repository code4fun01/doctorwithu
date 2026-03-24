const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getMyProfile,
  updateAvailability,
  updateConsultationFee,
  getCategories,
} = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getAllDoctors);
router.get('/categories/list', getCategories);
router.get('/me/profile', protect, restrictTo('doctor'), getMyProfile);
router.patch('/me/availability', protect, restrictTo('doctor'), updateAvailability);
router.patch('/me/consultation-fee', protect, restrictTo('doctor'), updateConsultationFee);
router.get('/:id', getDoctorById);

module.exports = router;
