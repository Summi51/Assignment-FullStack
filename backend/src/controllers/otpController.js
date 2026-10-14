const Otp = require('../models/Otp');
const { sendOtpSms } = require('../utils/sms');

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 30;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

// POST /api/otp/send
async function sendOtp(req, res) {
  try {
    const { phone } = req.body;

    if (!phone || !isValidPhone(phone)) {
      return res.status(400).json({ message: 'Valid 10-digit phone number is required' });
    }

    // Enforce resend cooldown
    const recent = await Otp.findOne({ phone }).sort({ createdAt: -1 });
    if (recent) {
      const secondsSinceLast = (Date.now() - recent.createdAt.getTime()) / 1000;
      if (secondsSinceLast < RESEND_COOLDOWN_SECONDS) {
        return res.status(429).json({
          message: `Please wait ${Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSinceLast)}s before requesting another OTP`,
        });
      }
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({ phone, code, expiresAt });
    const smsResult = await sendOtpSms(phone, code);

    return res.status(200).json({
      message: 'OTP sent successfully',
      mocked: Boolean(smsResult.mocked),
    });
  } catch (err) {
    console.error('sendOtp error:', err.message);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
}

// POST /api/otp/verify
async function verifyOtp(req, res) {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ message: 'Phone and code are required' });
    }

    const otpDoc = await Otp.findOne({ phone, verified: false }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({ message: 'No OTP request found. Please request a new OTP' });
    }

    if (otpDoc.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one' });
    }

    if (otpDoc.code !== code) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    otpDoc.verified = true;
    await otpDoc.save();

    return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('verifyOtp error:', err.message);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
}

module.exports = { sendOtp, verifyOtp };
