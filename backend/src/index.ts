import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    message: 'Effort Education Backend API is running!'
  });
});

// Basic API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Effort Education API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      courses: '/api/courses/*',
      students: '/api/students/*',
      enrollments: '/api/enrollments/*',
      admin: '/api/admin/*'
    }
  });
});

// Sample courses endpoint
app.get('/api/courses', (req, res) => {
  const sampleCourses = [
    {
      id: 1,
      title: "Banking Exams (PO/Clerk/SO)",
      description: "Complete preparation for IBPS, SBI, and other banking exams. Includes quantitative aptitude, reasoning, English, and general awareness with 200+ mock tests and personalized doubt sessions.",
      category: "government_exam",
      level: "intermediate",
      duration: 12,
      price: 15000,
      originalPrice: 20000,
      isActive: true,
      isFeatured: true,
      rating: 4.8,
      totalRatings: 150
    },
    {
      id: 2,
      title: "SSC CGL/CHSL/MTS",
      description: "Comprehensive SSC exam preparation with tier-wise strategy, previous year analysis, and specialized coaching for each subject. 95% success rate in SSC exams.",
      category: "government_exam",
      level: "advanced",
      duration: 16,
      price: 18000,
      originalPrice: 22000,
      isActive: true,
      isFeatured: true,
      rating: 4.9,
      totalRatings: 200
    },
    {
      id: 3,
      title: "Public Speaking & Communication",
      description: "Transform from shy to confident speaker! Weekly debate sessions, presentation workshops, and personality development programs. Build the communication skills that set you apart.",
      category: "public_speaking",
      level: "beginner",
      duration: 8,
      price: 8000,
      originalPrice: 10000,
      isActive: true,
      isFeatured: true,
      rating: 4.7,
      totalRatings: 85
    }
  ];

  res.json({
    success: true,
    data: {
      courses: sampleCourses,
      pagination: {
        page: 1,
        limit: 10,
        total: sampleCourses.length,
        pages: 1
      }
    }
  });
});

// Sample testimonials endpoint
app.get('/api/testimonials', (req, res) => {
  const testimonials = [
    {
      id: 1,
      quote: "I cleared SBI PO in my first attempt with AIR 45! The mock test series and personalized doubt sessions at Effort Education were game-changers. The faculty's expertise in banking exams is unmatched.",
      name: "Priya Sharma",
      role: "SBI PO, AIR 45",
      initials: "PS"
    },
    {
      id: 2,
      quote: "From being extremely shy to winning the district debate competition - Effort Education's public speaking program transformed me completely. The confidence I gained here helped me get selected for college leadership roles.",
      name: "Rajesh Kumar",
      role: "College Student Leader",
      initials: "RK"
    },
    {
      id: 3,
      quote: "My son cleared SSC CGL with rank 127! The comprehensive study plan and regular assessments at Effort Education made all the difference. The teachers are not just educators but mentors who truly care.",
      name: "Mrs. Anjali Patel",
      role: "Parent of SSC CGL Success",
      initials: "AP"
    }
  ];

  res.json({
    success: true,
    data: { testimonials }
  });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, phone, interest, message } = req.body;
  
  // In a real application, you would:
  // 1. Validate the input
  // 2. Save to database
  // 3. Send email notification
  // 4. Send auto-reply to user
  
  console.log('Contact form submission:', { name, email, phone, interest, message });
  
  res.json({
    success: true,
    message: 'Thank you for contacting us! We will get back to you within 24 hours.',
    data: {
      submissionId: Date.now(),
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Effort Education Backend API running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
});

export default app;
