import { Router } from 'express';
import User from '../models/User';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import { authenticateToken, AuthRequest, requireAdmin } from '../middleware/auth';

const router = Router();

// Apply admin authentication to all routes
router.use(authenticateToken, requireAdmin);

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', async (req: AuthRequest, res, next) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      enrollmentStats,
      recentUsers,
      recentEnrollments,
    ] = await Promise.all([
      User.count(),
      Course.count(),
      Enrollment.count(),
      Enrollment.getEnrollmentStats(),
      User.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'createdAt'],
      }),
      Enrollment.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['firstName', 'lastName', 'email'],
          },
          {
            model: Course,
            attributes: ['title', 'category'],
          },
        ],
      }),
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          ...enrollmentStats,
        },
        recentUsers,
        recentEnrollments,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
router.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (role) whereClause.role = role;
    if (search) {
      const { Op } = require('sequelize');
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] },
    });

    const total = await User.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        users,
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

// @desc    Get all courses
// @route   GET /api/admin/courses
// @access  Private (Admin)
router.get('/courses', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, isActive } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (category) whereClause.category = category;
    if (isActive !== undefined) whereClause.isActive = isActive === 'true';

    const courses = await Course.findAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

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

// @desc    Get all enrollments
// @route   GET /api/admin/enrollments
// @access  Private (Admin)
router.get('/enrollments', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, paymentStatus } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;

    const enrollments = await Enrollment.findAll({
      where: whereClause,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email'],
        },
        {
          model: Course,
          attributes: ['title', 'category', 'price'],
        },
      ],
    });

    const total = await Enrollment.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        enrollments,
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

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
router.patch('/users/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await user.update({ isActive });

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
router.patch('/users/:id/role', async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role',
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    await user.update({ role });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
