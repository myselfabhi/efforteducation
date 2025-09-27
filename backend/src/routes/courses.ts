import { Router } from 'express';
import { body, query, validationResult } from 'express-validator';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      level, 
      search, 
      featured, 
      minPrice, 
      maxPrice 
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = { isActive: true };

    // Apply filters
    if (category) whereClause.category = category;
    if (level) whereClause.level = level;
    if (featured === 'true') whereClause.isFeatured = true;
    if (minPrice) whereClause.price = { $gte: Number(minPrice) };
    if (maxPrice) whereClause.price = { ...whereClause.price, $lte: Number(maxPrice) };

    let courses;
    
    if (search) {
      courses = await Course.searchCourses(search as string);
    } else {
      courses = await Course.findAll({
        where: whereClause,
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']],
      });
    }

    const total = await Course.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
router.get('/featured', async (req, res, next) => {
  try {
    const courses = await Course.getFeaturedCourses();

    res.json({
      success: true,
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const courses = await Course.getCoursesByCategory(category);

    res.json({
      success: true,
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Get enrollment count
    const enrollmentCount = await Enrollment.count({
      where: { courseId: id, status: ['confirmed', 'completed'] },
    });

    res.json({
      success: true,
      data: {
        course: {
          ...course.toJSON(),
          currentStudents: enrollmentCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin/Teacher)
router.post('/', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;

    if (user.role !== 'admin' && user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin or Teacher role required.',
      });
    }

    const {
      title,
      description,
      shortDescription,
      category,
      level,
      duration,
      price,
      originalPrice,
      image,
      thumbnail,
      isFeatured,
      maxStudents,
      requirements,
      learningOutcomes,
      syllabus,
      startDate,
      endDate,
      registrationDeadline,
      tags,
    } = req.body;

    const course = await Course.create({
      title,
      description,
      shortDescription,
      category,
      level,
      duration,
      price,
      originalPrice,
      image,
      thumbnail,
      isFeatured: isFeatured || false,
      maxStudents,
      requirements,
      learningOutcomes,
      syllabus,
      instructorId: user.role === 'teacher' ? user.id : undefined,
      startDate,
      endDate,
      registrationDeadline,
      tags,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Teacher)
router.put('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Check permissions
    if (user.role === 'teacher' && course.instructorId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only update your own courses.',
      });
    }

    if (user.role !== 'admin' && user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin or Teacher role required.',
      });
    }

    await course.update(req.body);

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: { course },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.',
      });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Check if there are any enrollments
    const enrollmentCount = await Enrollment.count({
      where: { courseId: id },
    });

    if (enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete course with existing enrollments. Deactivate instead.',
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle course status
// @route   PATCH /api/courses/:id/toggle-status
// @access  Private (Admin/Teacher)
router.patch('/:id/toggle-status', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      });
    }

    // Check permissions
    if (user.role === 'teacher' && course.instructorId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You can only update your own courses.',
      });
    }

    if (user.role !== 'admin' && user.role !== 'teacher') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin or Teacher role required.',
      });
    }

    await course.update({ isActive: !course.isActive });

    res.json({
      success: true,
      message: `Course ${course.isActive ? 'deactivated' : 'activated'} successfully`,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
