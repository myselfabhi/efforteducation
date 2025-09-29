import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Testimonial interface
interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  initials: string;
  rating?: number;
  course?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock testimonials data (in production, this would come from a database)
const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "I cleared SBI PO in my first attempt with AIR 45! The mock test series and personalized doubt sessions at Effort Education were game-changers. The faculty's expertise in banking exams is unmatched.",
    name: "Priya Sharma",
    role: "SBI PO, AIR 45",
    initials: "PS",
    rating: 5,
    course: "Banking Exam Preparation",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    quote: "From being extremely shy to winning the district debate competition - Effort Education's public speaking program transformed me completely. The confidence I gained here helped me get selected for college leadership roles.",
    name: "Rajesh Kumar",
    role: "College Student Leader",
    initials: "RK",
    rating: 5,
    course: "Public Speaking & Communication",
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: 3,
    quote: "My son cleared SSC CGL with rank 127! The comprehensive study plan and regular assessments at Effort Education made all the difference. The teachers are not just educators but mentors who truly care.",
    name: "Mrs. Anjali Patel",
    role: "Parent of SSC CGL Success",
    initials: "AP",
    rating: 5,
    course: "SSC CGL Preparation",
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
  },
  {
    id: 4,
    quote: "The leadership program at Effort Education helped me develop confidence and communication skills that I use every day in my job. The practical approach and real-world examples made learning enjoyable.",
    name: "Amit Singh",
    role: "Software Engineer",
    initials: "AS",
    rating: 5,
    course: "Leadership & Life Skills",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 5,
    quote: "I was struggling with my studies until I joined Effort Education. The personalized attention and structured approach helped me improve my grades significantly. The teachers are amazing!",
    name: "Sneha Gupta",
    role: "Class 12 Student",
    initials: "SG",
    rating: 5,
    course: "School Enrichment Program",
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 6,
    quote: "The current affairs and GK sessions are incredibly comprehensive. I cleared multiple competitive exams thanks to the thorough preparation and regular updates provided by Effort Education.",
    name: "Vikram Joshi",
    role: "Government Officer",
    initials: "VJ",
    rating: 5,
    course: "General Knowledge & Current Affairs",
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  }
];

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, featured } = req.query;
    
    let filteredTestimonials = testimonials;
    
    // Filter featured testimonials if requested
    if (featured === 'true') {
      filteredTestimonials = testimonials.filter(t => t.rating === 5).slice(0, 3);
    }
    
    // Apply limit
    const limitNum = Number(limit);
    if (limitNum > 0) {
      filteredTestimonials = filteredTestimonials.slice(0, limitNum);
    }
    
    res.status(200).json({
      success: true,
      count: filteredTestimonials.length,
      data: {
        testimonials: filteredTestimonials
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single testimonial by ID
// @route   GET /api/testimonials/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const testimonial = testimonials.find(t => t.id === Number(req.params.id));
    
    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        testimonial
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
router.post('/', authenticateToken, [
  body('quote').notEmpty().withMessage('Quote is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req: AuthRequest, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { quote, name, role, rating = 5 } = req.body;
    
    // Generate initials from name
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const newTestimonial: Testimonial = {
      id: testimonials.length + 1,
      quote,
      name,
      role,
      initials,
      rating,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    testimonials.push(newTestimonial);
    
    res.status(201).json({
      success: true,
      data: {
        testimonial: newTestimonial
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
router.put('/:id', authenticateToken, [
  body('quote').optional().notEmpty().withMessage('Quote cannot be empty'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('role').optional().notEmpty().withMessage('Role cannot be empty'),
  body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
], async (req: AuthRequest, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const testimonialIndex = testimonials.findIndex(t => t.id === Number(req.params.id));
    
    if (testimonialIndex === -1) {
      return next(new AppError('Testimonial not found', 404));
    }
    
    const { quote, name, role, rating } = req.body;
    const testimonial = testimonials[testimonialIndex];
    
    if (quote) testimonial.quote = quote;
    if (name) {
      testimonial.name = name;
      testimonial.initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (role) testimonial.role = role;
    if (rating) testimonial.rating = rating;
    testimonial.updatedAt = new Date();
    
    res.status(200).json({
      success: true,
      data: {
        testimonial
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const testimonialIndex = testimonials.findIndex(t => t.id === Number(req.params.id));
    
    if (testimonialIndex === -1) {
      return next(new AppError('Testimonial not found', 404));
    }
    
    testimonials.splice(testimonialIndex, 1);
    
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
