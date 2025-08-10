import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/effort-education';
mongoose.connect(mongoUri).then(() => console.log('MongoDB connected')).catch((e) => console.error('Mongo error', e));

const port = Number(process.env.PORT || 5000);
app.listen(port, () => console.log(`API on http://localhost:${port}`));


