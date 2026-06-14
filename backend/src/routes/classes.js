import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

// GET LIVE CLASSES FOR STUDENT'S ENROLLED COURSES
router.get('/my-classes', verifyToken, async (req, res) => {
  try {
    // Get course IDs student is enrolled in
    const userEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: req.user.id,
        status: 'ACTIVE',
      },
      select: { courseId: true },
    });

    const courseIds = userEnrollments.map((e) => e.courseId);

    // Get classes for these courses
    const classes = await prisma.class.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        course: {
          select: { title: true },
        },
        attendance: {
          where: { userId: req.user.id },
          select: { present: true },
        },
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' },
      ],
    });

    // Format classes to return user attendance status
    const formattedClasses = classes.map((cls) => {
      const present = cls.attendance[0]?.present || false;
      const { attendance, ...rest } = cls;
      return { ...rest, present };
    });

    res.json(formattedClasses);
  } catch (error) {
    console.error('Fetch my classes error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// STUDENT: JOIN CLASS & AUTO-MARK PRESENT
router.post('/:id/join', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const cls = await prisma.class.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: req.user.id,
        courseId: cls.courseId,
        status: 'ACTIVE',
      },
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You are not enrolled in this course.' });
    }

    // Upsert attendance to true
    const attendance = await prisma.attendance.upsert({
      where: {
        userId_classId: {
          userId: req.user.id,
          classId: id,
        },
      },
      update: { present: true },
      create: {
        userId: req.user.id,
        classId: id,
        present: true,
      },
    });

    res.json({
      message: 'Attendance marked successfully. Redirecting to class...',
      meetingLink: cls.meetingLink,
      attendance,
    });
  } catch (error) {
    console.error('Join class error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: GET ALL CLASSES
router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        course: { select: { title: true } },
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' },
      ],
    });
    res.json(classes);
  } catch (error) {
    console.error('Admin fetch classes error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: CREATE CLASS
router.post('/admin', verifyToken, isAdmin, async (req, res) => {
  const { courseId, title, meetingLink, date, time } = req.body;

  if (!courseId || !title || !meetingLink || !date || !time) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const cls = await prisma.class.create({
      data: { courseId, title, meetingLink, date, time },
    });
    res.status(201).json(cls);
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: GET ATTENDANCE FOR A CLASS
router.get('/admin/:id/attendance', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const cls = await prisma.class.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // Get all students enrolled in the course
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: cls.courseId, status: 'ACTIVE' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    // Get all attendance entries for this class
    const attendanceRecords = await prisma.attendance.findMany({
      where: { classId: id },
    });

    // Merge students with their attendance status
    const attendanceList = enrollments.map((enr) => {
      const record = attendanceRecords.find((r) => r.userId === enr.userId);
      return {
        id: enr.user.id,
        name: enr.user.name,
        email: enr.user.email,
        phone: enr.user.phone,
        present: record ? record.present : false,
      };
    });

    res.json({
      class: cls,
      students: attendanceList,
    });
  } catch (error) {
    console.error('Fetch class attendance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: TOGGLE STUDENT ATTENDANCE
router.post('/admin/:classId/attendance/:userId', verifyToken, isAdmin, async (req, res) => {
  const { classId, userId } = req.params;
  const { present } = req.body;

  if (present === undefined) {
    return res.status(400).json({ message: 'Present field (boolean) is required.' });
  }

  try {
    const record = await prisma.attendance.upsert({
      where: {
        userId_classId: { userId, classId },
      },
      update: { present },
      create: { userId, classId, present },
    });
    res.json(record);
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// ADMIN: DELETE CLASS
router.delete('/admin/:id', verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.class.delete({ where: { id } });
    res.json({ message: 'Class successfully deleted.' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
