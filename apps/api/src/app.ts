import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

const app = express();

app.use(express.json());
app.use(cors({
  origin: env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());

app.use('/api', routes);

app.use(errorHandler);

export { app };
