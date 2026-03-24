const mongoose = require('mongoose');

const pendingSignupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    doctorInfo: {
      category: String,
      experience: Number,
      consultationFee: Number,
      description: String,
    },
    otp: { type: String, required: true, select: false },
    otpExpires: { type: Date, required: true, select: false },
  },
  { timestamps: true }
);

// Auto-delete pending signups after 15 minutes
pendingSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 });

module.exports = mongoose.model('PendingSignup', pendingSignupSchema);

