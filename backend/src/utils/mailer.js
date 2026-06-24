import nodemailer from 'nodemailer';

const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass || user.includes('your-email') || pass.includes('your-app-password')) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a registration/login OTP code verification email.
 * @param {string} email
 * @param {string} otpCode
 * @param {string} name
 */
export const sendOTPEmail = async (email, otpCode, name = '') => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || 'no-reply@darshitech.com';
  
  const subject = 'Your Verification OTP Code - Darshi Software Solutions Private Limited';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #0c3c60; text-align: center;">DARSHI SOFTWARE SOLUTIONS PRIVATE LIMITED</h2>
      <p>Hello ${name || 'User'},</p>
      <p>Thank you for choosing our platform. To complete your email verification, please use the following One-Time Password (OTP):</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #b8975a; background-color: #f7fafc; padding: 10px 20px; border: 1px dashed #b8975a; border-radius: 5px; display: inline-block;">
          ${otpCode}
        </span>
      </div>
      <p style="color: #4a5568; font-size: 14px;">This code is valid for 1 hour. Please do not share this OTP with anyone.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #718096; font-size: 12px; text-align: center;">This is an automated system email. Please do not reply to this message.</p>
    </div>
  `;

  if (!transporter) {
    console.warn(`[MAILER NOT CONFIGURED] Real email could not be sent to ${email}. Verification OTP: ${otpCode}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: htmlContent,
    });
    console.log(`[MAILER] Successfully sent verification email to ${email}`);
    return true;
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send verification email to ${email}:`, error);
    return false;
  }
};

/**
 * Sends a password reset OTP code email.
 * @param {string} email
 * @param {string} otpCode
 * @param {string} name
 */
export const sendResetPasswordEmail = async (email, otpCode, name = '') => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || 'no-reply@darshitech.com';
  
  const subject = 'Your Password Reset Code - Darshi Software Solutions Private Limited';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #0c3c60; text-align: center;">DARSHI SOFTWARE SOLUTIONS PRIVATE LIMITED</h2>
      <p>Hello ${name || 'User'},</p>
      <p>We received a request to reset your account password. Please use the following 6-digit code to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #e53e3e; background-color: #fff5f5; padding: 10px 20px; border: 1px dashed #e53e3e; border-radius: 5px; display: inline-block;">
          ${otpCode}
        </span>
      </div>
      <p style="color: #4a5568; font-size: 14px;">This reset code is valid for 15 minutes. If you did not request this, please ignore this email or contact support.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #718096; font-size: 12px; text-align: center;">This is an automated system email. Please do not reply to this message.</p>
    </div>
  `;

  if (!transporter) {
    console.warn(`[MAILER NOT CONFIGURED] Real email could not be sent to ${email}. Reset code: ${otpCode}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject,
      html: htmlContent,
    });
    console.log(`[MAILER] Successfully sent password reset email to ${email}`);
    return true;
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send password reset email to ${email}:`, error);
    return false;
  }
};
