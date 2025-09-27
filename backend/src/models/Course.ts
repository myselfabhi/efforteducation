import { DataTypes, Model, Optional, Op } from 'sequelize';
import sequelize from '../config/database';

export interface CourseAttributes {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: 'government_exam' | 'school_enrichment' | 'leadership' | 'public_speaking';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in weeks
  price: number;
  originalPrice?: number;
  image?: string;
  thumbnail?: string;
  isActive: boolean;
  isFeatured: boolean;
  maxStudents?: number;
  currentStudents: number;
  requirements?: string;
  learningOutcomes?: string;
  syllabus?: string;
  instructorId?: number;
  startDate?: Date;
  endDate?: Date;
  registrationDeadline?: Date;
  tags?: string[];
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'currentStudents' | 'rating' | 'totalRatings' | 'createdAt' | 'updatedAt'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public shortDescription?: string;
  public category!: 'government_exam' | 'school_enrichment' | 'leadership' | 'public_speaking';
  public level!: 'beginner' | 'intermediate' | 'advanced';
  public duration!: number;
  public price!: number;
  public originalPrice?: number;
  public image?: string;
  public thumbnail?: string;
  public isActive!: boolean;
  public isFeatured!: boolean;
  public maxStudents?: number;
  public currentStudents!: number;
  public requirements?: string;
  public learningOutcomes?: string;
  public syllabus?: string;
  public instructorId?: number;
  public startDate?: Date;
  public endDate?: Date;
  public registrationDeadline?: Date;
  public tags?: string[];
  public rating!: number;
  public totalRatings!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Virtual fields
  public get isDiscounted(): boolean {
    return this.originalPrice ? this.originalPrice > this.price : false;
  }

  public get discountPercentage(): number {
    if (!this.isDiscounted) return 0;
    return Math.round(((this.originalPrice! - this.price) / this.originalPrice!) * 100);
  }

  public get isRegistrationOpen(): boolean {
    if (!this.isActive) return false;
    if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
    if (this.maxStudents && this.currentStudents >= this.maxStudents) return false;
    return true;
  }

  // Class methods
  public static async getFeaturedCourses(): Promise<Course[]> {
    return this.findAll({
      where: { isFeatured: true, isActive: true },
      order: [['createdAt', 'DESC']],
      limit: 6,
    });
  }

  public static async getCoursesByCategory(category: string): Promise<Course[]> {
    return this.findAll({
      where: { category, isActive: true },
      order: [['createdAt', 'DESC']],
    });
  }

  public static async searchCourses(searchTerm: string): Promise<Course[]> {
    return this.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchTerm}%` } },
          { description: { [Op.iLike]: `%${searchTerm}%` } },
          { tags: { [Op.contains]: [searchTerm] } },
        ],
      },
      order: [['rating', 'DESC']],
    });
  }
}

Course.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [10, 500],
      },
    },
    category: {
      type: DataTypes.ENUM('government_exam', 'school_enrichment', 'leadership', 'public_speaking'),
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner',
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    maxStudents: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    currentStudents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    learningOutcomes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    syllabus: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    totalRatings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
  }
);

export default Course;
