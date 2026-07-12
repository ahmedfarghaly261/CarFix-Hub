import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  repairRequestId: mongoose.Types.ObjectId;
  mechanicId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  workQuality?: number;
  timeliness?: number;
  communication?: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    repairRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'RepairRequest',
      required: true,
    },
    mechanicId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    workQuality: {
      type: Number,
      min: 1,
      max: 5,
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5,
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);
