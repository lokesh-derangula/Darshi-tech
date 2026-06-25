import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import Prisma and Middleware
import prisma from './utils/prisma.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { sanitizeInput } from './middleware/security.js';

// Import Route Handlers
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import enrollmentRoutes from './routes/enrollments.js';
import classRoutes from './routes/classes.js';
import certificateRoutes from './routes/certificates.js';
import adminRoutes from './routes/admin.js';
import { verifySMTP } from './utils/mailer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // For development. Restrict to specific domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsers & Sanitization
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(sanitizeInput);

// Global API rate limiting
app.use('/api/', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Mounting Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// Database Seeding Logic
const seedDatabase = async () => {
  try {
    // 1. Seed Default Admin User
    const adminEmail = 'admin@darshitech.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('AdminPassword123', 12);
      await prisma.user.create({
        data: {
          name: 'Darshi Software Solutions Private Limited Admin',
          email: adminEmail,
          phone: '9876543210',
          password: hashedPassword,
          college: 'Darshi Software Solutions Private Limited Corporate',
          branch: 'Administration',
          year: 'NA',
          role: 'ADMIN',
          isVerified: true,
        },
      });
      console.log('✔ Seeding admin user: admin@darshitech.com / AdminPassword123');
    }

    // 2. Seed Default Courses
    const courseCount = await prisma.course.count();
    if (courseCount === 0) {
      const sampleCourses = [
        // Research
        {
          title: 'NLP & Transformer Architectures',
          description: 'Dive deep into NLP, Attention mechanisms, and Transformer architectures. Work on seq2seq models, fine-tuning BERT, and custom attention layers.',
          duration: '8 Weeks',
          price: 2500,
          category: 'Research',
          thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80',
          status: 'ACTIVE',
        },
        {
          title: 'LLM Fine-Tuning & AI Applications',
          description: 'Learn parameter-efficient fine-tuning (PEFT, LoRA), prompt engineering, and building production-grade RAG applications using LangChain and vector databases.',
          duration: '10 Weeks',
          price: 2500,
          category: 'Research',
          thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80',
          status: 'ACTIVE',
        },
        {
          title: 'Quantum Technology & Computing',
          description: 'Introduction to qubits, quantum gates, entanglement, and running quantum circuits on IBM Quantum experience using Qiskit.',
          duration: '8 Weeks',
          price: 2500,
          category: 'Research',
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80',
          status: 'ACTIVE',
        },
        // Full Stack
        {
          title: 'React & Node.js Full Stack Development',
          description: 'Complete hands-on internship covering React, Redux, Node.js, Express, databases (PostgreSQL/MongoDB), secure authentication, and REST APIs.',
          duration: '12 Weeks',
          price: 2500,
          category: 'Full Stack',
          thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80',
          status: 'ACTIVE',
        },
        {
          title: 'Django & React Enterprise Internship',
          description: 'Learn backend scaling using Django REST Framework, database optimization, Celery background tasks, and React frontend integration.',
          duration: '8 Weeks',
          price: 2500,
          category: 'Full Stack',
          thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&q=80',
          status: 'ACTIVE',
        },
        // Product Development
        {
          title: 'Enterprise ERP System Design',
          description: 'Build complex, scalable enterprise software from scratch. Learn Multi-tenancy, reporting pipelines, permission engines, and invoice generation.',
          duration: '12 Weeks',
          price: 2500,
          category: 'Product Development',
          thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80',
          status: 'ACTIVE',
        },
        {
          title: 'AI Product Engineering',
          description: 'Learn to wrap ML models into functional SaaS products. Covers microservices, FastAPI wrappers, user analytics, and Stripe payment scaling.',
          duration: '10 Weeks',
          price: 2500,
          category: 'Product Development',
          thumbnail: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?w=500&q=80',
          status: 'ACTIVE',
        },
        // Web Development
        {
          title: 'Modern Web Apps & Gaming Portals',
          description: 'Build interactive user experiences, web sockets, Canvas games, and real-time state machines using modern web techniques.',
          duration: '6 Weeks',
          price: 2500,
          category: 'Web Development',
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=80',
          status: 'ACTIVE',
        },
        {
          title: 'Android App Development (React Native)',
          description: 'Cross-platform mobile apps for Android. Learn native APIs, storage, notifications, and deploying apps to the Google Play Store.',
          duration: '8 Weeks',
          price: 2500,
          category: 'Web Development',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80',
          status: 'ACTIVE',
        },
        // Workshops
        {
          title: 'Generative AI & Prompt Engineering Workshop',
          description: 'A 2-day live interactive workshop for learning prompt patterns, ChatGPT API, Claude integrations, and building AI tools locally.',
          duration: '2 Days',
          price: 2500,
          category: 'Workshops',
          thumbnail: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=500&q=80',
          status: 'ACTIVE',
        },
        // Training
        {
          title: 'JEE Mains & EAPCET Preparation',
          description: 'Comprehensive course for cracking engineering entrance exams. Includes recorded classes, live mock test discussions, and extensive question banks.',
          duration: '24 Weeks',
          price: 2500,
          category: 'Training',
          thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80',
          status: 'ACTIVE',
        },
        {
          title: 'Aptitude & Soft Skills Mastery',
          description: 'Prepare for campus placements. Quantitative aptitude, logical reasoning, verbal ability, resume building, and mock interviews.',
          duration: '6 Weeks',
          price: 2500,
          category: 'Training',
          thumbnail: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80',
          status: 'ACTIVE',
        },
      ];

      await prisma.course.createMany({ data: sampleCourses });
      console.log('✔ Seeding sample courses catalog');
    }

    // Force update all course prices in the database to 2500
    const updateResult = await prisma.course.updateMany({
      data: { price: 2500 }
    });
    console.log(`✔ Verified/Updated ${updateResult.count} courses to price 2500`);

    // Force update the LLM course thumbnail to a working image
    await prisma.course.updateMany({
      where: { title: 'LLM Fine-Tuning & AI Applications' },
      data: { thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&q=80' }
    });
    console.log('✔ Updated LLM Fine-Tuning course thumbnail URL');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await seedDatabase();
  await verifySMTP();
});
