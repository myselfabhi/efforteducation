import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Contact form interface
interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

// Mock storage for contact submissions (in production, this would be a database)
const contactSubmissions: ContactSubmission[] = [];

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').optional().isString(),
  body('interest').notEmpty().withMessage('Area of interest is required'),
  body('message').notEmpty().withMessage('Message is required').isLength({ min: 10 }).withMessage('Message must be at least 10 characters long')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { name, email, phone, interest, message } = req.body;
    
    const newSubmission: ContactSubmission = {
      id: contactSubmissions.length + 1,
      name,
      email,
      phone,
      interest,
      message,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    contactSubmissions.push(newSubmission);
    
    // In production, you would:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send auto-reply to user
    // 4. Add to CRM system
    
    console.log('New contact form submission:', {
      id: newSubmission.id,
      name: newSubmission.name,
      email: newSubmission.email,
      interest: newSubmission.interest,
      timestamp: newSubmission.createdAt
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        submissionId: newSubmission.id,
        timestamp: newSubmission.createdAt.toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private (Admin)
router.get('/', async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    let filteredSubmissions = contactSubmissions;
    
    if (status) {
      filteredSubmissions = contactSubmissions.filter(s => s.status === status);
    }
    
    // Apply pagination
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const offset = (pageNum - 1) * limitNum;
    
    const paginatedSubmissions = filteredSubmissions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limitNum);
    
    res.status(200).json({
      success: true,
      count: paginatedSubmissions.length,
      total: contactSubmissions.length,
      page: pageNum,
      pages: Math.ceil(contactSubmissions.length / limitNum),
      data: {
        submissions: paginatedSubmissions
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single contact submission (Admin only)
// @route   GET /api/contact/:id
// @access  Private (Admin)
router.get('/:id', async (req, res, next) => {
  try {
    const submission = contactSubmissions.find(s => s.id === Number(req.params.id));
    
    if (!submission) {
      return next(new AppError('Contact submission not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: {
        submission
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update contact submission status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
router.put('/:id/status', [
  body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Invalid status')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const submissionIndex = contactSubmissions.findIndex(s => s.id === Number(req.params.id));
    
    if (submissionIndex === -1) {
      return next(new AppError('Contact submission not found', 404));
    }
    
    const { status } = req.body;
    contactSubmissions[submissionIndex].status = status;
    contactSubmissions[submissionIndex].updatedAt = new Date();
    
    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: {
        submission: contactSubmissions[submissionIndex]
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
