import mongoose, { Document, Schema } from 'mongoose';

export interface IRepairOrder extends Document {
  carId: mongoose.Types.ObjectId;
  mechanicId?: mongoose.Types.ObjectId;
  status: 'pending' | 'in-progress' | 'completed';
  issuesReported: string;
  workDone?: string;
  cost: number;
  createdAt: Date;
  updatedAt: Date;
}

const repairOrderSchema = new Schema<IRepairOrder>(
  {
    carId: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
    mechanicId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    issuesReported: { type: String, required: true },
    workDone: { type: String },
    cost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const RepairOrder = mongoose.model<IRepairOrder>('RepairOrder', repairOrderSchema);
