import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'repair_update' | 'status_change' | 'cost_update' | 'job_completed' | 'invoice' | 'system' | 'other';
  read: boolean;
  relatedTo?: {
    model: 'RepairRequest' | 'Car' | 'Workshop';
    id: mongoose.Types.ObjectId;
  };
  emailSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['repair_update', 'status_change', 'cost_update', 'job_completed', 'invoice', 'system', 'other'],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    relatedTo: {
      model: {
        type: String,
        enum: ['RepairRequest', 'Car', 'Workshop'],
      },
      id: Schema.Types.ObjectId,
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, read: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
