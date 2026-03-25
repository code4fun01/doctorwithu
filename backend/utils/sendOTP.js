const nodemailer = require('nodemailer');

const getSmtpTransporter = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  console.log('[DEBUG] SMTP Config:', { host, user, port, passExists: !!pass });

  if (!host || !user || !pass) {
    console.error('[ERROR] Missing SMTP configuration. Please check .env file');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 5000,
    socketTimeout: 5000,
  });
};

const sendOTP = async (email, otp) => {
  console.log('[OTP] Starting OTP send to:', email);
  
  const subject = 'DoctorWithU - OTP Verification';
  const text = `Your DoctorWithU verification code is ${otp}. It is valid for 10 minutes.`;

  // 1) Use Nodemailer (SMTP) if configured
  const transporter = getSmtpTransporter();
  if (transporter) {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@doctorwithu.com';
    try {
      console.log('[OTP] Sending via Gmail SMTP...');
      await transporter.sendMail({ from, to: email, subject, text });
      console.log('✅ OTP email sent successfully to', email);
      return;
    } catch (error) {
      console.error('❌ Error sending OTP via Nodemailer:', error.message);
    }
  }

  // Fallback: log to console (dev only)
  console.log('========================================');
  console.log('[OTP SIMULATION] No email provider configured, logging OTP instead');
  console.log(`[OTP SIMULATION] Email: ${email}`);
  console.log(`[OTP SIMULATION] Your verification code: ${otp}`);
  console.log('========================================');
};

module.exports = sendOTP;

