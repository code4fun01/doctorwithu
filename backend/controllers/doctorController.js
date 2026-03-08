const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.getAllDoctors = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const doctors = await Doctor.find(filter).populate('userId', 'name email');
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch doctors.' });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch doctor.' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch profile.' });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { availableDays, availableSlots } = req.body;
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (availableSlots !== undefined) doctor.availableSlots = availableSlots;
    await doctor.save();
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Update failed.' });
  }
};

exports.updateConsultationFee = async (req, res) => {
  try {
    const { consultationFee } = req.body;
    if (consultationFee === undefined || consultationFee < 0) {
      return res.status(400).json({ success: false, message: 'Valid consultation fee is required.' });
    }
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }
    doctor.consultationFee = consultationFee;
    await doctor.save();
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Update failed.' });
  }
};
