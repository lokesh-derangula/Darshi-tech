import { Router } from 'express';
import prisma from '../utils/prisma.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { generateCertificatePDF } from '../utils/pdfGenerator.js';

const router = Router();

// PUBLIC: VERIFY CERTIFICATE
router.get('/verify/:enrollmentId', async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: { select: { name: true, college: true } },
        course: { select: { title: true, duration: true, category: true } },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ verified: false, message: 'Certificate ID is invalid.' });
    }

    if (enrollment.status !== 'COMPLETED') {
      return res.status(400).json({
        verified: false,
        message: 'This certificate has not been completed or issued yet.',
      });
    }

    res.json({
      verified: true,
      certificateId: enrollment.id,
      studentName: enrollment.user.name,
      college: enrollment.user.college,
      courseTitle: enrollment.course.title,
      duration: enrollment.course.duration,
      category: enrollment.course.category,
      issuedAt: enrollment.updatedAt,
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// STUDENT: DOWNLOAD CERTIFICATE PDF (GENERATE ON-THE-FLY)
router.get('/download/:enrollmentId', verifyToken, async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        user: true,
        course: true,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment/Certificate not found.' });
    }

    // Authorization: User must own the certificate OR be an admin
    if (enrollment.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized access.' });
    }

    if (enrollment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Certificate has not been issued yet. Please contact your administrator.' });
    }

    // Helpers for domain name mapping and date formatting
    const getDomainForCategory = (category) => {
      switch (category) {
        case 'Research': return 'Research & Development';
        case 'Full Stack': return 'Full Stack Development';
        case 'Product Development': return 'Product Development';
        case 'Web Development': return 'Web Development';
        case 'Workshops': return 'Technical Workshops';
        case 'Training': return 'Skill Development & Training';
        default: return `${category} Development`;
      }
    };

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Calculate sequential certificate serial number based on completion date order
    const completedCount = await prisma.enrollment.count({
      where: {
        status: 'COMPLETED',
        updatedAt: { lte: enrollment.updatedAt },
      },
    });
    const serialStr = String(completedCount).padStart(4, '0');
    const certNo = `DSSPL/2026/CT/${serialStr}`;

    // Generate PDF to stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${enrollmentId.substring(0, 8)}.pdf`);

    await generateCertificatePDF(res, {
      studentName: enrollment.user.name,
      courseTitle: enrollment.course.title,
      domainName: getDomainForCategory(enrollment.course.category),
      startDate: formatDate(enrollment.enrolledAt),
      endDate: formatDate(enrollment.updatedAt),
      certNo,
      issueDate: formatDate(enrollment.updatedAt),
      certificateId: enrollment.id,
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate certificate.' });
    }
  }
});

// ADMIN: MARK ENROLLMENT AS COMPLETED (ISSUES CERTIFICATE)
router.post('/complete/:enrollmentId', verifyToken, isAdmin, async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const enrollment = await prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'COMPLETED' },
    });

    res.json({ message: 'Enrollment marked as COMPLETED. Certificate issued.', enrollment: updated });
  } catch (error) {
    console.error('Complete enrollment error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
