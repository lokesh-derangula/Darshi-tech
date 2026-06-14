import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'darshi_tech_super_secret_jwt_key_2026';

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// STUDENT REGISTER
router.post('/register', authLimiter, async (req, res) => {
  const { name, email, phone, password, college, branch, year } = req.body;

  if (!name || !email || !phone || !password || !college || !branch || !year) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        college,
        branch,
        year,
        isVerified: false,
        otpCode,
        otpExpiry,
        role: 'STUDENT',
      },
    });

    console.log(`[VERIFICATION EMAIL] Sent OTP to ${email}: ${otpCode}`);

    res.status(201).json({
      message: 'Registration successful! Please verify your email.',
      email: user.email,
      otpSandbox: otpCode, // Provided for easy developer testing
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// STUDENT & ADMIN LOGIN
router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      // Regenerate OTP and send if not verified
      const otpCode = generateOTP();
      const otpExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpiry },
      });
      console.log(`[VERIFICATION EMAIL] Sent OTP to ${email}: ${otpCode}`);
      return res.status(403).json({
        message: 'Email not verified. Verification code has been sent.',
        email: user.email,
        otpSandbox: otpCode,
        unverified: true,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        branch: user.branch,
        year: user.year,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// EMAIL VERIFICATION (OTP)
router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'Email and code are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified.' });
    }

    if (user.otpCode !== code || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired verification code.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiry: null,
      },
    });

    res.json({ message: 'Email successfully verified! You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// FORGOT PASSWORD (OTP GENERATION)
router.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Silent error or generic response for security to prevent enumeration,
      // but in a demo sandbox, let's tell them for better developer experience
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    const otpCode = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode, otpExpiry },
    });

    console.log(`[PASSWORD RESET EMAIL] Sent OTP to ${email}: ${otpCode}`);

    res.json({
      message: 'Password reset code sent to email.',
      email: user.email,
      otpSandbox: otpCode,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otpCode !== code || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiry: null,
        isVerified: true, // Auto verify if they reset password successfully via email verification
      },
    });

    res.json({ message: 'Password has been successfully updated.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET PROFILE
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        branch: true,
        year: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// UPDATE PROFILE
router.put('/profile', verifyToken, async (req, res) => {
  const { name, phone, college, branch, year } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, college, branch, year },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        branch: true,
        year: true,
        role: true,
      },
    });
    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
