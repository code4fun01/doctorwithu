const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/generateOTP');
const sendOTP = require('../utils/sendOTP');
const PendingSignup = require('../models/PendingSignup');
const bcrypt = require('bcryptjs');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = 'patient', doctorInfo } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing?.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    // If an unverified user exists from the older flow, remove it and allow a fresh signup
    if (existing && !existing.isVerified) {
      await User.deleteOne({ _id: existing._id });
    }
    const otp = generateOTP(6);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 12);

    await PendingSignup.findOneAndUpdate(
      { email },
      {
        name,
        email,
        passwordHash,
        role,
        doctorInfo,
        otp,
        otpExpires,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendOTP(email, otp);
    res.status(201).json({
      success: true,
      message: 'Signup successful. Please verify OTP.',
      email,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Signup failed.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email with OTP before logging in.' });
    }
    const token = createToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }
    const pending = await PendingSignup.findOne({ email }).select('+otp +otpExpires +passwordHash');
    if (!pending) {
      return res.status(404).json({ success: false, message: 'No pending signup found. Please sign up again.' });
    }
    if (pending.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    if (new Date() > pending.otpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.passwordHash, // already hashed; User model won't hash again
      role: pending.role,
      isVerified: true,
    });

    if (pending.role === 'doctor' && pending.doctorInfo) {
      const Doctor = require('../models/Doctor');
      const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
      const defaultDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      await Doctor.create({
        userId: user._id,
        name: pending.name,
        category: pending.doctorInfo.category,
        experience: pending.doctorInfo.experience,
        consultationFee: pending.doctorInfo.consultationFee,
        description: pending.doctorInfo.description,
        availableDays: defaultDays,
        availableSlots: defaultSlots,
      });
    }

    await PendingSignup.deleteOne({ _id: pending._id });

    const token = createToken(user._id);
    res.json({
      success: true,
      message: 'OTP verified successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: true },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Verification failed.' });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    const pending = await PendingSignup.findOne({ email }).select('+otp +otpExpires');
    if (!pending) {
      return res.status(404).json({ success: false, message: 'No pending signup found. Please sign up again.' });
    }
    const otp = generateOTP(6);
    pending.otp = otp;
    pending.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await pending.save({ validateBeforeSave: false });
    await sendOTP(email, otp);
    res.json({ success: true, message: 'OTP resent. Check console for development.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Resend failed.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to get user.' });
  }
};
