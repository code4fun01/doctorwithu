const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'completed', 'no-show'],
      default: 'scheduled',
    },
  },
  { timestamps: true }
);

// Create unique index to prevent double booking
// Only applies to 'scheduled' status appointments
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, appointmentTime: 1, status: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: 'scheduled' },
    name: 'unique_doctor_slot_booking'
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
