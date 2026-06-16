import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a professional payment receipt PDF and pipes it to a writable stream.
 * @param {import('stream').Writable} writeStream - Express response or output stream.
 * @param {object} enrollment - Enrollment data including user, course, and transaction ID.
 */
export const generateReceiptPDF = (writeStream, enrollment) => {
  const { user, course, paymentId, enrolledAt, id: enrollmentId } = enrollment;

  // Formatting dates
  const payDate = new Date(enrolledAt);
  const day = String(payDate.getDate()).padStart(2, '0');
  const month = String(payDate.getMonth() + 1).padStart(2, '0');
  const year = payDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const receiptNo = `REC-2026-${paymentId.substring(0, 8).toUpperCase()}`;

  // Back-calculating tax breakdown (18% total: 9% CGST, 9% SGST)
  const totalAmount = course.price;
  const baseAmount = totalAmount / 1.18;
  const cgst = baseAmount * 0.09;
  const sgst = baseAmount * 0.09;

  // Initialize portrait Letter size PDF document
  const doc = new PDFDocument({
    size: 'LETTER',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  doc.pipe(writeStream);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // Outer thin gray layout border
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
    .lineWidth(1)
    .stroke('#e2e8f0');

  // Header Logo (Top Left)
  const logoPath = path.join(__dirname, '../../../frontend/public/darshi-logo.png');
  try {
    doc.image(logoPath, 40, 35, { width: 70 });
  } catch (err) {
    console.error("Error loading logo image, using vector fallback:", err);
    // Draw vector fallback
    doc.circle(75, 65, 20).lineWidth(1.5).stroke('#b8975a');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#0c3c60').text('DARSHI', 55, 60, { width: 40, align: 'center' });
  }

  // Header Company Info (Top Right)
  doc.font('Helvetica-Bold').fontSize(14).fillColor('#0c3c60').text('DARSHI SOFTWARE SOLUTIONS PVT. LTD.', 130, 35, { align: 'right' });
  doc.font('Helvetica').fontSize(8.5).fillColor('#4a5568')
    .text('CIN: U62099AP2026PTC126197  |  Established: 2026', 130, 52, { align: 'right' })
    .text('# 87/1368-HIG-II-40, Road No 1, AP Housing Board Colony, Kurnool, AP, 518002', 130, 66, { align: 'right' })
    .text('Email: info@darshitech.com  |  Tel: 9121237729', 130, 80, { align: 'right' });

  // Decorative divider
  doc.moveTo(40, 95).lineTo(pageWidth - 40, 95).lineWidth(1.5).stroke('#0c3c60');

  // Receipt Title
  doc.font('Helvetica-Bold').fontSize(16).fillColor('#1a202c').text('PAYMENT RECEIPT', 40, 115);

  // Receipt Meta Grid (Two Columns)
  const metaY = 145;
  doc.rect(40, metaY, pageWidth - 80, 55).fill('#f7fafc');

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Receipt Number:', 55, metaY + 12);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(receiptNo, 150, metaY + 12);

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Payment Date:', 55, metaY + 32);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(formattedDate, 150, metaY + 32);

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Transaction ID:', 320, metaY + 12);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(paymentId, 410, metaY + 12);

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Payment Status:', 320, metaY + 32);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#38a169').text('PAID / SETTLED', 410, metaY + 32);

  // Billing Details Section
  const billY = 225;
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#0c3c60').text('Billed To Student', 40, billY);
  doc.moveTo(40, billY + 16).lineTo(pageWidth - 40, billY + 16).lineWidth(0.5).stroke('#cbd5e0');

  const detailsY = billY + 26;
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Student Name:', 40, detailsY);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(user.name, 130, detailsY);

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Registered Email:', 40, detailsY + 18);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(user.email, 130, detailsY + 18);

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Contact Phone:', 40, detailsY + 36);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(user.phone || 'N/A', 130, detailsY + 36);

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Institution:', 300, detailsY);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(user.college, 390, detailsY, { width: pageWidth - 430 });

  doc.font('Helvetica-Bold').fontSize(9).fillColor('#4a5568').text('Degree / Stream:', 300, detailsY + 18);
  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c').text(`${user.branch} (${user.year})`, 390, detailsY + 18);

  // Ledger Table Details
  const tableY = 320;
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#0c3c60').text('Enrollment Ledger Details', 40, tableY);
  doc.moveTo(40, tableY + 16).lineTo(pageWidth - 40, tableY + 16).lineWidth(0.5).stroke('#cbd5e0');

  // Table Header
  const thY = tableY + 26;
  doc.rect(40, thY, pageWidth - 80, 22).fill('#0c3c60');
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff')
    .text('S.No', 50, thY + 6)
    .text('Course / Internship Title', 95, thY + 6)
    .text('Track', 340, thY + 6)
    .text('Duration', 420, thY + 6)
    .text('Amount (INR)', 490, thY + 6, { align: 'right', width: 70 });

  // Table Row
  const trY = thY + 22;
  doc.rect(40, trY, pageWidth - 80, 26).fill('#f7fafc');
  doc.font('Helvetica').fontSize(9).fillColor('#1a202c')
    .text('1', 50, trY + 8)
    .text(course.title, 95, trY + 8, { width: 235, height: 18 })
    .text(`${course.category} Track`, 340, trY + 8)
    .text(course.duration, 420, trY + 8)
    .text(`₹${course.price.toFixed(2)}`, 490, trY + 8, { align: 'right', width: 70 });

  // Financial Breakdown Block
  const breakY = trY + 45;
  const breakX = pageWidth - 260;

  doc.font('Helvetica').fontSize(9.5).fillColor('#4a5568')
    .text('Taxable Base Price:', breakX, breakY)
    .text('CGST (9.0%):', breakX, breakY + 16)
    .text('SGST (9.0%):', breakX, breakY + 32);

  doc.font('Helvetica').fontSize(9.5).fillColor('#1a202c')
    .text(`₹${baseAmount.toFixed(2)}`, breakX + 130, breakY, { align: 'right', width: 90 })
    .text(`₹${cgst.toFixed(2)}`, breakX + 130, breakY + 16, { align: 'right', width: 90 })
    .text(`₹${sgst.toFixed(2)}`, breakX + 130, breakY + 32, { align: 'right', width: 90 });

  doc.moveTo(breakX, breakY + 48).lineTo(pageWidth - 40, breakY + 48).lineWidth(1).stroke('#cbd5e0');

  doc.font('Helvetica-Bold').fontSize(11).fillColor('#0c3c60')
    .text('Total Settled Amount:', breakX, breakY + 56);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#0c3c60')
    .text(`₹${totalAmount.toFixed(2)}`, breakX + 130, breakY + 56, { align: 'right', width: 90 });

  // Footer / Attestation details
  const footerY = pageHeight - 120;
  doc.moveTo(40, footerY).lineTo(pageWidth - 40, footerY).lineWidth(0.5).stroke('#cbd5e0');

  // Seal / Signatory indicator
  doc.circle(85, footerY + 50, 25).lineWidth(1).stroke('#a0aec0');
  doc.font('Helvetica-Bold').fontSize(5.5).fillColor('#a0aec0')
    .text('DARSHI TECH', 65, footerY + 42, { width: 40, align: 'center' })
    .text('PAID SEAL', 65, footerY + 50, { width: 40, align: 'center' })
    .text('ELECTRONIC', 65, footerY + 58, { width: 40, align: 'center' });

  doc.font('Helvetica').fontSize(8).fillColor('#718096')
    .text('This document is a computer-generated transaction payment receipt.', 130, footerY + 25)
    .text('All settlements are authenticated electronically. No physical signature is required.', 130, footerY + 37)
    .text('For queries regarding billing, contact billing@darshitech.com referencing the Transaction ID.', 130, footerY + 49);

  doc.font('Helvetica').fontSize(7.5).fillColor('#a0aec0').text(`Enrollment Reference ID: ${enrollmentId}`, 40, pageHeight - 32);

  doc.end();
};
