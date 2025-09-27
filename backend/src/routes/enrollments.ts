import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import { authenticateToken, AuthRequest, requireStudent } from '../middleware/auth';

const router = Router();

// @desc    Enroll in course
// @route   POST /api/enrollments
// @access  Private (Student)
router.post('/', authenticateToken, requireStudent, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        error: 'Course ID is required',
      });
    }

    // Check if course exists and is active
    const course = await Course.findByPk(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Course not found or inactive',
      });
    }

    // Check if registration is open
    if (!course.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        error: 'Course registration is closed',
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { userId: user.id, courseId },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        error: 'You are already enrolled in this course',
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: user.id,
      courseId,
      status: 'pending',
      paymentStatus: 'pending',
      amount: course.price,
    });

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
router.get('/:id', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    // Check if user has access to this enrollment
    if (user.role !== 'admin' && enrollment.userId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Get course details
    const course = await Course.findByPk(enrollment.courseId);

    res.json({
      success: true,
      data: {
        enrollment: {
          ...enrollment.toJSON(),
          course,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update enrollment status
// @route   PATCH /api/enrollments/:id/status
// @access  Private (Admin)
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const { status, paymentStatus, paymentId, paymentMethod } = req.body;

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.',
      });
    }

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentId) updateData.paymentId = paymentId;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;

    await enrollment.update(updateData);

    res.json({
      success: true,
      message: 'Enrollment status updated successfully',
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private (Student)
router.delete('/:id', authenticateToken, requireStudent, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: 'Enrollment not found',
      });
    }

    // Check if user owns this enrollment
    if (enrollment.userId !== user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Check if enrollment can be cancelled
    if (enrollment.status === 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel completed enrollment',
      });
    }

    await enrollment.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Enrollment cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
