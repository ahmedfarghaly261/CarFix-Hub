import mongoose, { Document, Schema } from 'mongoose';

export interface ICar extends Omit<Document, 'model'> {
  userId: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year?: number;
  color?: string;
  vin?: string;
  licensePlate?: string;
  mileage: number;
  fuelType?: string;
  transmission?: string;
  createdAt: Date;
  updatedAt: Date;
}

const carSchema = new Schema<ICar>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    color: { type: String },
    vin: { type: String, unique: true, sparse: true },
    licensePlate: { type: String, unique: true, sparse: true },
    mileage: { type: Number, default: 0 },
    fuelType: { type: String },
    transmission: { type: String },
  },
  { timestamps: true }
);

export const Car = mongoose.model<ICar>('Car', carSchema);
