import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

// GET ALL ACTIVE COURSES
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const where = { status: 'ACTIVE' };
    if (category) {
      where.category = category;
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (error) {
    console.error('Fetch courses error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET SINGLE COURSE DETAILS
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        classes: {
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.json(course);
  } catch (error) {
    console.error('Fetch course error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: CREATE COURSE
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { title, description, duration, price, category, thumbnail, status } = req.body;

  if (!title || !description || !duration || price === undefined || !category) {
    return res.status(400).json({ message: 'Title, description, duration, price, and category are required.' });
  }

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        duration,
        price: parseFloat(price),
        category,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
        status: status || 'ACTIVE',
      },
    });
    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: UPDATE COURSE
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, duration, price, category, thumbnail, status } = req.body;

  try {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        duration,
        price: price !== undefined ? parseFloat(price) : undefined,
        category,
        thumbnail,
        status,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: DELETE COURSE
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course successfully deleted.' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
