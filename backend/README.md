# Effort Education Backend API

A robust Node.js/Express backend API for the Effort Education platform built with TypeScript, PostgreSQL, and Sequelize ORM.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Course Management** - CRUD operations for courses with categories and levels
- **Student Enrollment** - Course enrollment system with payment tracking
- **Admin Dashboard** - Comprehensive admin panel for managing users, courses, and enrollments
- **File Upload** - Support for course materials and profile pictures
- **Email Notifications** - Automated email system for enrollments and updates
- **Rate Limiting** - API protection with configurable rate limits
- **Security** - Helmet, CORS, and input validation
- **Database** - PostgreSQL with Sequelize ORM

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd effort-education/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=effort_education
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb effort_education
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm run build
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Courses
- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/featured` - Get featured courses
- `GET /api/courses/category/:category` - Get courses by category
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Admin/Teacher)
- `PUT /api/courses/:id` - Update course (Admin/Teacher)
- `DELETE /api/courses/:id` - Delete course (Admin)
- `PATCH /api/courses/:id/toggle-status` - Toggle course status

### Enrollments
- `POST /api/enrollments` - Enroll in course (Student)
- `GET /api/enrollments/:id` - Get enrollment details
- `PATCH /api/enrollments/:id/status` - Update enrollment status (Admin)
- `DELETE /api/enrollments/:id` - Cancel enrollment (Student)

### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/enrollments` - Get student enrollments
- `GET /api/students/enrollments/active` - Get active enrollments

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/courses` - Get all courses
- `GET /api/admin/enrollments` - Get all enrollments
- `PATCH /api/admin/users/:id/status` - Update user status
- `PATCH /api/admin/users/:id/role` - Update user role

## 🗄️ Database Schema

### Users Table
- User authentication and profile information
- Roles: student, teacher, admin
- Profile data and contact information

### Courses Table
- Course details, pricing, and metadata
- Categories: government_exam, school_enrichment, leadership, public_speaking
- Levels: beginner, intermediate, advanced

### Enrollments Table
- Student course enrollments
- Payment status and progress tracking
- Certificate management

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛡️ Security Features

- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Express-validator for request validation
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Configurable CORS settings
- **Helmet** - Security headers
- **JWT Security** - Secure token-based authentication

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your-production-db-host
DB_NAME=effort_education_prod
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

## 📝 Default Admin Account

On first startup, a default admin account is created:
- **Email**: admin@efforteducation.com
- **Password**: admin123456

⚠️ **Important**: Change the default password in production!

## 🔧 Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Clean build directory

### Project Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@efforteducation.com or create an issue in the repository.
