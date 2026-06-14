import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// GET CURRENT STUDENT'S ENROLLMENTS
router.get('/my-enrollments', verifyToken, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            duration: true,
            price: true,
            category: true,
            thumbnail: true,
            status: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
    res.json(enrollments);
  } catch (error) {
    console.error('Fetch my enrollments error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// SIMULATE RAZORPAY ORDER CREATION
router.post('/create-order', verifyToken, async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required.' });
  }

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if already enrolled in an active state
    const existing = await prisma.enrollment.findFirst({
      where: {
        userId: req.user.id,
        courseId,
        status: 'ACTIVE',
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'You are already enrolled in this course/internship.' });
    }

    // Generate a mock order ID
    const orderId = `order_${Math.random().toString(36).substring(2, 15)}`;

    // Return the course details along with mock order details to the client
    res.json({
      id: orderId,
      amount: course.price * 100, // Razorpay works in paise
      currency: 'INR',
      courseId: course.id,
      courseTitle: course.title,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// VERIFY PAYMENT & CREATE ACTIVE ENROLLMENT
router.post('/verify-payment', verifyToken, async (req, res) => {
  const { courseId, paymentId, signature, orderId } = req.body;

  if (!courseId || !paymentId) {
    return res.status(400).json({ message: 'Course ID and Payment ID are required.' });
  }

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // In a real application, you verify the HMAC signature:
    // const body = orderId + "|" + paymentId;
    // const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)...
    // For our sandbox, we accept any valid mock key/sig
    
    // Create the enrollment record in active state
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: req.user.id,
        courseId,
        paymentId,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      message: 'Payment verified and enrollment created successfully!',
      enrollment,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
