import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';

export interface EnrollmentAttributes {
  id: number;
  userId: number;
  courseId: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  paymentMethod?: string;
  amount: number;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // percentage (0-100)
  certificateIssued: boolean;
  certificateUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, 'id' | 'enrolledAt' | 'progress' | 'certificateIssued' | 'createdAt' | 'updatedAt'> {}

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  public id!: number;
  public userId!: number;
  public courseId!: number;
  public status!: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
  public paymentId?: string;
  public paymentMethod?: string;
  public amount!: number;
  public enrolledAt!: Date;
  public completedAt?: Date;
  public progress!: number;
  public certificateIssued!: boolean;
  public certificateUrl?: string;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields
  public get isActive(): boolean {
    return this.status === 'confirmed' || this.status === 'completed';
  }

  public get isCompleted(): boolean {
    return this.status === 'completed';
  }

  public get canAccessCourse(): boolean {
    return this.status === 'confirmed' || this.status === 'completed';
  }

  // Class methods
  public static async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return this.findAll({
      where: { userId },
      order: [['enrolledAt', 'DESC']],
    });
  }

  public static async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return this.findAll({
      where: { courseId },
      order: [['enrolledAt', 'DESC']],
    });
  }

  public static async getActiveEnrollments(userId: number): Promise<Enrollment[]> {
    return this.findAll({
      where: { 
        userId, 
        status: { [Op.in]: ['confirmed', 'completed'] }
      },
      order: [['enrolledAt', 'DESC']],
    });
  }

  public static async getEnrollmentStats(): Promise<{
    total: number;
    confirmed: number;
    completed: number;
    pending: number;
    cancelled: number;
  }> {
    const stats = await this.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true,
    });

    const result = {
      total: 0,
      confirmed: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    stats.forEach((stat: any) => {
      const count = parseInt(stat.count);
      result.total += count;
      result[stat.status as keyof typeof result] = count;
    });

    return result;
  }
}

Enrollment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    enrolledAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    certificateIssued: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    certificateUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Enrollment',
    tableName: 'enrollments',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId'],
      },
    ],
  }
);

export default Enrollment;
