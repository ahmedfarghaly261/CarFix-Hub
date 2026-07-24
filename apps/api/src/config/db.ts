import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env.js';

dns.setServers(['1.1.1.1', '1.0.0.1']);

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
