require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all patient users
    const patients = await User.find({ role: 'patient' }).select('_id');
    const patientIds = patients.map((p) => p._id);

    console.log('Patients found:', patientIds.length);

    if (patientIds.length > 0) {
      // Delete appointments belonging to these patients
      const aptResult = await Appointment.deleteMany({ patientId: { $in: patientIds } });
      console.log('Appointments deleted:', aptResult.deletedCount);

      // Delete the patients
      const userResult = await User.deleteMany({ _id: { $in: patientIds } });
      console.log('Patients deleted:', userResult.deletedCount);
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();