/**
 * Simulated OTP sender - logs OTP to console for development.
 * Replace with actual SMS/Email service in production.
 */
const sendOTP = (email, otp) => {
  console.log('========================================');
  console.log(`[OTP SIMULATION] Email: ${email}`);
  console.log(`[OTP SIMULATION] Your verification code: ${otp}`);
  console.log('========================================');
  return Promise.resolve();
};

module.exports = sendOTP;
