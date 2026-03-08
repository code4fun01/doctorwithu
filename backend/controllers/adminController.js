const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch users.' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name category consultationFee')
      .sort({ appointmentDate: -1, appointmentTime: 1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch appointments.' });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { name, email, password, category, experience, consultationFee, description, availableDays, availableSlots } = req.body;
    if (!name || !email || !password || !category || experience === undefined || consultationFee === undefined) {
      return res.status(400).json({ success: false, message: 'Name, email, password, category, experience and consultationFee are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: 'doctor',
      isVerified: true,
    });
    const doctor = await Doctor.create({
      userId: user._id,
      name,
      category,
      experience: experience || 0,
      consultationFee: consultationFee || 0,
      description: description || '',
      availableDays: availableDays || [],
      availableSlots: availableSlots || [],
    });
    res.status(201).json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, doctor },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to add doctor.' });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    await User.findByIdAndDelete(doctor.userId);
    await Doctor.findByIdAndDelete(doctor._id);
    await Appointment.deleteMany({ doctorId: doctor._id });
    res.json({ success: true, message: 'Doctor deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete doctor.' });
  }
};
