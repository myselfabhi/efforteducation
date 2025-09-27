import { Router } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import { authenticateToken, AuthRequest, requireStudent } from '../middleware/auth';

const router = Router();

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
router.get('/profile', authenticateToken, requireStudent, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get student enrollments
// @route   GET /api/students/enrollments
// @access  Private (Student)
router.get('/enrollments', authenticateToken, requireStudent, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const enrollments = await Enrollment.getUserEnrollments(user.id);

    // Get course details for each enrollment
    const enrollmentsWithCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await Course.findByPk(enrollment.courseId);
        return {
          ...enrollment.toJSON(),
          course,
        };
      })
    );

    res.json({
      success: true,
      data: { enrollments: enrollmentsWithCourses },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get active enrollments
// @route   GET /api/students/enrollments/active
// @access  Private (Student)
router.get('/enrollments/active', authenticateToken, requireStudent, async (req: AuthRequest, res, next) => {
  try {
    const user = req.user!;
    const enrollments = await Enrollment.getActiveEnrollments(user.id);

    // Get course details for each enrollment
    const enrollmentsWithCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await Course.findByPk(enrollment.courseId);
        return {
          ...enrollment.toJSON(),
          course,
        };
      })
    );

    res.json({
      success: true,
      data: { enrollments: enrollmentsWithCourses },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
