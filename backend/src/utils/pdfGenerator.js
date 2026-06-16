import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates an authentic certificate PDF matching the demo certificate layout.
 * @param {import('stream').Writable} writeStream - Express response or output stream.
 * @param {object} params - Parameters containing student and course completion details.
 */
export const generateCertificatePDF = async (writeStream, { studentName, courseTitle, domainName, startDate, endDate, certNo, issueDate, certificateId }) => {
  // Generate QR Code data URL for certificate verification
  const verificationUrl = `http://localhost:5173/verify-certificate/${certificateId}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { margin: 1, width: 100 });

  // Initialize a landscape A4 PDF document
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4',
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
  });

  doc.pipe(writeStream);

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // 1. Double Borders (Matching the demo certificate layout)
  // Outer thin blue border
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30)
    .lineWidth(1.5)
    .stroke('#0c3c60');

  // Thick blue border
  doc.rect(23, 23, pageWidth - 46, pageHeight - 46)
    .lineWidth(4)
    .stroke('#0c3c60');

  // Inner thin slate gray border
  doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
    .lineWidth(1)
    .stroke('#778899');

  // 2. Logo (Top Left)
  const logoPath = path.join(__dirname, '../../../frontend/public/darshi-logo.png');
  try {
    doc.image(logoPath, 50, 45, { width: 95 });
  } catch (err) {
    console.error("Error loading logo image, using vector fallback:", err);
    // Draw a fallback vector logo
    doc.circle(95, 80, 25).lineWidth(2).stroke('#b8975a');
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#0c3c60').text('DARSHI', 70, 74, { width: 50, align: 'center' });
    doc.font('Helvetica').fontSize(5).text('SOFTWARE SOLUTIONS', 60, 88, { width: 70, align: 'center' });
  }

  // 3. Top Header Title Box
  const headerBoxWidth = 480;
  const headerBoxX = (pageWidth - headerBoxWidth) / 2;
  doc.roundedRect(headerBoxX, 42, headerBoxWidth, 32, 6).fill('#0c3c60');

  // Text inside Header Box
  doc.font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('#ffffff')
    .text('DARSHI SOFTWARE SOLUTIONS PRIVATE LIMITED', headerBoxX, 51, { width: headerBoxWidth, align: 'center' });

  // Address details under Header Box
  doc.font('Helvetica-Bold').fontSize(9).fillColor('#1a1a1a').text('CIN : U62099AP2026PTC126197   |   Estb: 2026', headerBoxX, 80, { width: headerBoxWidth, align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor('#4a4a4a').text('# 87/1368-HIG-II-40, Road No 1, AP Housing Board Colony, Joharapuram, Kurnool, Andhra Pradesh, India, Pin 518002', 150, 93, { width: pageWidth - 300, align: 'center' });
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#1a1a1a').text('Tel: 9121237729  |  8179075149', headerBoxX, 106, { width: headerBoxWidth, align: 'center' });

  // 4. Metadata (Top Right)
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#1a1a1a')
    .text(`Cert. No. : ${certNo}`, pageWidth - 240, 80, { width: 190, align: 'right' });
  doc.text(`Date : ${issueDate}`, pageWidth - 240, 98, { width: 190, align: 'right' });

  // 5. Main Title: "Certificate of Completion"
  doc.font('Times-Bold')
    .fontSize(34)
    .fillColor('#0c3c60')
    .text('Certificate of Completion', 0, 132, { align: 'center' });

  // Diamond ornament separator
  const centerY = 175;
  doc.moveTo(280, centerY).lineTo(395, centerY).lineWidth(1).stroke('#0c3c60');
  doc.moveTo(446.89, centerY).lineTo(561.89, centerY).lineWidth(1).stroke('#0c3c60');
  doc.moveTo(420.94, centerY - 4).lineTo(426.94, centerY).lineTo(420.94, centerY + 4).lineTo(414.94, centerY).closePath().fill('#0c3c60');
  doc.moveTo(410.94, centerY - 2).lineTo(413.94, centerY).lineTo(410.94, centerY + 2).lineTo(407.94, centerY).closePath().fill('#0c3c60');
  doc.moveTo(430.94, centerY - 2).lineTo(433.94, centerY).lineTo(430.94, centerY + 2).lineTo(427.94, centerY).closePath().fill('#0c3c60');

  // 6. Certificate Body (precise alignments on drawn line underscores)
  const line1Y = 210;
  const line2Y = 245;
  const line3Y = 280;
  const line4Y = 315;

  // Line 1: studentName
  doc.font('Times-Italic').fontSize(14).fillColor('#222222').text('This is to certify that Mr./Mrs.', 60, line1Y);
  doc.moveTo(240, line1Y + 13).lineTo(pageWidth - 60, line1Y + 13).lineWidth(0.75).stroke('#4a4a4a');
  doc.font('Times-Bold').fontSize(16).fillColor('#000000').text(studentName, 240, line1Y - 1, { width: pageWidth - 300, align: 'center' });

  // Line 2: courseTitle
  doc.font('Times-Italic').fontSize(14).fillColor('#222222').text('has successfully completed the', 60, line2Y);
  doc.moveTo(250, line2Y + 13).lineTo(pageWidth - 60, line2Y + 13).lineWidth(0.75).stroke('#4a4a4a');
  doc.font('Times-Bold').fontSize(15).fillColor('#000000').text(courseTitle, 250, line2Y - 1, { width: pageWidth - 310, align: 'center' });

  // Line 3: domainName
  doc.font('Times-Italic').fontSize(14).fillColor('#222222').text('in the domain of', 60, line3Y);
  doc.moveTo(170, line3Y + 13).lineTo(pageWidth - 60, line3Y + 13).lineWidth(0.75).stroke('#4a4a4a');
  doc.font('Times-Bold').fontSize(14).fillColor('#000000').text(domainName, 170, line3Y - 1, { width: pageWidth - 230, align: 'center' });

  // Line 4: dates and company
  doc.font('Times-Italic').fontSize(14).fillColor('#222222').text('from', 60, line4Y);
  doc.moveTo(95, line4Y + 13).lineTo(195, line4Y + 13).lineWidth(0.75).stroke('#4a4a4a');
  doc.font('Times-Bold').fontSize(13).fillColor('#000000').text(startDate, 95, line4Y - 1, { width: 100, align: 'center' });

  doc.font('Times-Italic').fontSize(14).fillColor('#222222').text('to', 202, line4Y);
  doc.moveTo(222, line4Y + 13).lineTo(322, line4Y + 13).lineWidth(0.75).stroke('#4a4a4a');
  doc.font('Times-Bold').fontSize(13).fillColor('#000000').text(endDate, 222, line4Y - 1, { width: 100, align: 'center' });

  doc.font('Times-Italic').fontSize(14).fillColor('#222222').text('at', 328, line4Y);
  doc.moveTo(345, line4Y + 13).lineTo(pageWidth - 60, line4Y + 13).lineWidth(0.75).stroke('#4a4a4a');
  doc.font('Times-Bold').fontSize(14).fillColor('#000000').text('Darshi Software Solutions Private Limited.', 345, line4Y - 1, { width: pageWidth - 405, align: 'center' });

  // 7. Dedication & success paragraphs
  const paraY = 352;
  doc.font('Times-Italic').fontSize(13).fillColor('#333333')
    .text('During the internship, the candidate has demonstrated dedication, sincerity,', 60, paraY)
    .text('and a strong commitment to learning.', 60, paraY + 18)
    .text('We wish the candidate success in all future endeavors.', 60, paraY + 36);

  // 8. Footer section
  const footerY = pageHeight - 95;

  // Checked By (Left)
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1a1a1a').text('Checked By', 60, footerY);
  doc.font('Helvetica').fontSize(9.5).fillColor('#4a4a4a').text(`Date : ${issueDate}`, 60, footerY + 16);

  // Verification QR Code (Next to Checked By)
  doc.image(qrDataUrl, 170, footerY - 15, { width: 50, height: 50 });
  doc.font('Helvetica').fontSize(6.5).fillColor('#9ca3af').text('Scan to Verify', 170, footerY + 38, { width: 50, align: 'center' });

  // Seal / Stamp (Center)
  const sealX = pageWidth / 2;
  const sealY = pageHeight - 75;
  doc.circle(sealX, sealY, 36).lineWidth(1.5).stroke('#0c3c60');
  doc.circle(sealX, sealY, 30).lineWidth(0.75).stroke('#0c3c60');
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#0c3c60')
    .text('DARSHI SOFTWARE', sealX - 40, sealY - 14, { width: 80, align: 'center' })
    .text('SOLUTIONS', sealX - 40, sealY - 5, { width: 80, align: 'center' })
    .fontSize(7)
    .text('KURNOOL', sealX - 40, sealY + 6, { width: 80, align: 'center' });

  // Authorized Signatory (Right)
  const sigX = pageWidth - 260;
  doc.moveTo(sigX, footerY - 5).lineTo(pageWidth - 60, footerY - 5).lineWidth(1).stroke('#4a4a4a');
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1a1a1a').text('Authorized Signatory', sigX, footerY, { width: 200, align: 'center' });
  doc.font('Helvetica').fontSize(9.5).fillColor('#4a4a4a').text('Darshi Software Solutions Pvt. Ltd.', sigX, footerY + 16, { width: 200, align: 'center' });

  // Document unique id indicator (bottom thin metadata)
  doc.font('Helvetica').fontSize(7.5).fillColor('#9ca3af').text(`Verification ID: ${certificateId}`, 60, pageHeight - 20);

  doc.end();
};
