const axios = require('axios');

/**
 * Sends an SMS OTP using the Fast2SMS API (India).
 * Requires FAST2SMS_API_KEY in environment variables.
 * Docs: https://docs.fast2sms.com/
 *
 * If no API key is configured, falls back to logging the OTP
 * to the console so local/dev testing still works without real SMS.
 */
async function sendOtpSms(phone, code) {
  const apiKey = process.env.FAST2SMS_API_KEY;

  if (!apiKey) {
    console.log(`[DEV MODE] No FAST2SMS_API_KEY set. OTP for ${phone} is: ${code}`);
    return { mocked: true };
  }

  const response = await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      route: 'otp',
      variables_values: code,
      numbers: phone,
    },
    {
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

module.exports = { sendOtpSms };
