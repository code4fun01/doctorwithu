const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/generateOTP');
const sendOTP = require('../utils/sendOTP');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role = 'patient' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }
    const otp = generateOTP(6);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const user = await User.create({
      name,
      email,
      password,
      role: role === 'admin' ? 'patient' : role,
      otp,
      otpExpires,
    });
    await sendOTP(email, otp);
    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      message: 'Signup successful. Please verify OTP.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
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
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.isVerified) {
      return res.json({ success: true, message: 'Already verified.', user: { id: user._id, name: user.name, email: user.email, role: user.role, isVerified: true } });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'OTP expired.' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
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
    const user = await User.findOne({ email }).select('+otp +otpExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.isVerified) {
      return res.json({ success: true, message: 'Already verified.' });
    }
    const otp = generateOTP(6);
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
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
