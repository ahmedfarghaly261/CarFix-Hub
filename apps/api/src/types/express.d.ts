import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: any; // To be replaced with typed User document
    }
  }
}
