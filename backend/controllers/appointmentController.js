const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime } = req.body;
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ success: false, message: 'Doctor, date and time are required.' });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    if (!doctor.availableSlots.includes(appointmentTime)) {
      return res.status(400).json({ success: false, message: 'Selected time slot is not available.' });
    }
    const date = new Date(appointmentDate);
    const dayName = date.toLocaleDateString('en-IN', { weekday: 'long' });
    if (!doctor.availableDays.includes(dayName)) {
      return res.status(400).json({ success: false, message: 'Doctor is not available on this day.' });
    }
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate: date,
      appointmentTime,
      status: 'scheduled',
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This slot is already booked.' });
    }
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate: date,
      appointmentTime,
    });
    await appointment.populate([{ path: 'doctorId', select: 'name category consultationFee' }, { path: 'patientId', select: 'name email' }]);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Booking failed.' });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'name category consultationFee')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch appointments.' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user.id });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    if (appointment.status !== 'scheduled') {
      return res.status(400).json({ success: false, message: 'Only scheduled appointments can be cancelled.' });
    }
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Cancel failed.' });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.user.id });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found.' });
    }
    const appointments = await Appointment.find({ doctorId: doctor._id, status: 'scheduled' })
      .populate('patientId', 'name email')
      .sort({ appointmentDate: 1, appointmentTime: 1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch appointments.' });
  }
};
