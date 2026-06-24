import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

// Apply admin protection to all routes in this file
router.use(verifyToken, isAdmin);

// GET ADMIN DASHBOARD METRICS
router.get('/stats', async (req, res) => {
  try {
    const studentCount = await prisma.user.count({
      where: { role: 'STUDENT' },
    });

    const activeCourseCount = await prisma.course.count({
      where: { status: 'ACTIVE' },
    });

    const certificateCount = await prisma.enrollment.count({
      where: { status: 'COMPLETED' },
    });

    // Fetch all active and completed enrollments to calculate revenue
    const enrollments = await prisma.enrollment.findMany({
      include: {
        course: {
          select: { price: true },
        },
      },
    });

    const totalRevenue = enrollments.reduce((sum, enr) => sum + (enr.course?.price || 0), 0);

    res.json({
      totalStudents: studentCount,
      activeInternships: activeCourseCount,
      certificatesIssued: certificateCount,
      totalRevenue,
    });
  } catch (error) {
    console.error('Fetch admin stats error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET LIST OF ALL STUDENTS
router.get('/students', async (req, res) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        branch: true,
        year: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET LIST OF ALL ENROLLMENTS & PAYMENTS
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        course: {
          select: { title: true, price: true },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    res.json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// CREATE NEW STUDENT
router.post('/students', async (req, res) => {
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

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        college,
        branch,
        year,
        role: 'STUDENT',
        isVerified: true, // Auto-verified when created by admin
      },
    });

    res.status(201).json({
      message: 'Student created successfully.',
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        branch: user.branch,
        year: user.year,
      },
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// DELETE STUDENT
router.delete('/students/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const student = await prisma.user.findUnique({ where: { id } });
    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({ message: 'Student not found.' });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'Student deleted successfully.' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
