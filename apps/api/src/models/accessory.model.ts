import mongoose, { Document, Schema } from 'mongoose';

export interface IAccessory extends Document {
  name: string;
  category?: string;
  price: number;
  description?: string;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const accessorySchema = new Schema<IAccessory>(
  {
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Accessory = mongoose.model<IAccessory>('Accessory', accessorySchema);
