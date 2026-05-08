import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createAdapter } from '@socket.io/redis-adapter';
import { pubClient, subClient } from '../redis';
import { setupQuizSocket } from './quizController';
import { setupClassSocket } from './classController';

let _io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  const allowedOrigins = [
    'https://efforteducation.in',
    'https://www.efforteducation.in',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ];

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Redis adapter for horizontal scaling
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Socket.IO Redis adapter configured');

  // JWT authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as any;
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  // Per-user room for notifications and direct pushes
  io.on('connection', (socket) => {
    const user = (socket as any).user;
    if (user?.id) socket.join(`user:${user.id}`);
  });

  // Feature handlers
  setupQuizSocket(io);
  setupClassSocket(io);

  _io = io;
  console.log('Socket.IO initialized');
  return io;
}

export function getIO(): Server {
  if (!_io) throw new Error('Socket.IO not initialized');
  return _io;
}
