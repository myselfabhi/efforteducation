import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { initSocket } from './socket';
import authRoutes from './routes/auth';
import quizRoutes from './routes/quiz';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import batchRoutes from './routes/batches';
import materialsRoutes from './routes/materials';
import classRoutes from './routes/classes';
import announcementsRoutes from './routes/announcements';
import notificationsRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3002', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
// materials/classes/announcements mount at root because their paths are nested + flat
app.use('/api', materialsRoutes);
app.use('/api', classRoutes);
app.use('/api', announcementsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Socket.IO
initSocket(server);

// Start server
const PORT = parseInt(process.env.PORT || '4000', 10);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Effort Education backend on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1] || 'configured'}`);
});

export default app;
