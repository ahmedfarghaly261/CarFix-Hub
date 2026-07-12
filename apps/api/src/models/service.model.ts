import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description?: string;
  price: number;
  duration: string;
  category: 'maintenance' | 'repair' | 'diagnostics' | 'customization';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['maintenance', 'repair', 'diagnostics', 'customization'],
      default: 'maintenance',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model<IService>('Service', serviceSchema);
