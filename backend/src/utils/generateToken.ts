import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { env } from '../config/env.js';

export const generateToken = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
