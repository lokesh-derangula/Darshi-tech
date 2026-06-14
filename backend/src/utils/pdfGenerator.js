import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

/**
 * Generates a certificate PDF dynamically and pipes it to a writable stream.
 * @param {import('stream').Writable} writeStream - Express response or output stream.
 * @param {string} studentName - Name of the student.
 * @param {string} courseTitle - Name of the course or internship.
 * @param {string} duration - Duration of the course (e.g., "8 Weeks").
 * @param {string} certificateId - Unique database ID of the enrollment.
 */
export const generateCertificatePDF = async (writeStream, studentName, courseTitle, duration, certificateId) => {
  // Generate QR Code data URL for certificate verification
  const verificationUrl = `http://localhost:5173/verify-certificate/${certificateId}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1, width: 150 });

  // Initialize a landscape A4 PDF document
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  doc.pipe(writeStream);

  // Outer primary border
  doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(4)
    .stroke('#1e3a8a'); // Deep navy blue

  // Inner accent border
  doc.rect(26, 26, doc.page.width - 52, doc.page.height - 52)
    .lineWidth(1.5)
    .stroke('#3b82f6'); // Vibrant light blue

  // Decorative corner accents (geometric lines)
  const drawCornerAccent = (x, y, xDir, yDir) => {
    doc.moveTo(x, y)
      .lineTo(x + xDir * 30, y)
      .lineTo(x + xDir * 30, y + yDir * 30)
      .lineTo(x, y)
      .fill('#1e3a8a');
  };
  // Top-Left
  drawCornerAccent(28, 28, 1, 1);
  // Top-Right
  drawCornerAccent(doc.page.width - 28, 28, -1, 1);
  // Bottom-Left
  drawCornerAccent(28, doc.page.height - 28, 1, -1);
  // Bottom-Right
  drawCornerAccent(doc.page.width - 28, doc.page.height - 28, -1, -1);

  // Main Header Logo / Text
  doc.font('Helvetica-Bold')
    .fontSize(36)
    .fillColor('#1e3a8a')
    .text('DARSHI TECH', 0, 80, { align: 'center' });

  // Subtitle
  doc.font('Helvetica')
    .fontSize(16)
    .fillColor('#4b5563')
    .text('CERTIFICATE OF COMPLETION', 0, 135, { align: 'center', characterSpacing: 2 });

  // Presentation text
  doc.font('Helvetica-Oblique')
    .fontSize(14)
    .fillColor('#6b7280')
    .text('This is proudly presented to', 0, 190, { align: 'center' });

  // Student Name
  doc.font('Helvetica-Bold')
    .fontSize(32)
    .fillColor('#111827')
    .text(studentName, 0, 215, { align: 'center' });

  // Internship detail text
  doc.font('Helvetica')
    .fontSize(14)
    .fillColor('#4b5563')
    .text('for successfully completing the internship program in', 0, 260, { align: 'center' });

  // Course Title
  doc.font('Helvetica-Bold')
    .fontSize(22)
    .fillColor('#3b82f6')
    .text(courseTitle, 0, 285, { align: 'center' });

  // Duration
  doc.font('Helvetica')
    .fontSize(14)
    .fillColor('#4b5563')
    .text(`with a duration of ${duration}.`, 0, 315, { align: 'center' });

  // Embed the verification QR code
  doc.image(qrDataUrl, doc.page.width - 170, doc.page.height - 165, { width: 100, height: 100 });
  
  doc.font('Helvetica')
    .fontSize(8)
    .fillColor('#9ca3af')
    .text('Scan to Verify Authentic Certificate', doc.page.width - 180, doc.page.height - 55, { width: 120, align: 'center' });

  // Left Signatures section
  doc.moveTo(80, doc.page.height - 85)
    .lineTo(240, doc.page.height - 85)
    .lineWidth(1)
    .stroke('#d1d5db');

  doc.font('Helvetica-Bold')
    .fontSize(11)
    .fillColor('#111827')
    .text('Authorized Signatory', 80, doc.page.height - 75, { width: 160, align: 'center' });

  doc.font('Helvetica')
    .fontSize(9)
    .fillColor('#6b7280')
    .text('Darshi Tech Admin Panel', 80, doc.page.height - 60, { width: 160, align: 'center' });

  // Certificate Unique Identifier
  doc.font('Helvetica')
    .fontSize(9)
    .fillColor('#9ca3af')
    .text(`Certificate ID: ${certificateId}`, 40, doc.page.height - 40, { width: 400, align: 'left' });

  doc.end();
};
