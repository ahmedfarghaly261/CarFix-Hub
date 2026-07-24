import mongoose, { Document, Schema } from 'mongoose';

export interface IRepairIteration extends Document {
  description: string;
  mechanicNotes?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  cost?: {
    parts?: {
      name?: string;
      price?: number;
      quantity?: number;
    }[];
    labor?: number;
    total?: number;
  };
  completedAt?: Date;
  mechanicId?: mongoose.Types.ObjectId;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const repairIterationSchema = new Schema<IRepairIteration>(
  {
    description: {
      type: String,
      required: true,
    },
    mechanicNotes: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    cost: {
      parts: [
        {
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
      labor: Number,
      total: Number,
    },
    completedAt: Date,
    mechanicId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [String],
  },
  {
    timestamps: true,
  }
);

export interface IRepairRequest extends Document {
  carId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  workshopId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  serviceType?: string;
  requestedDate?: string;
  notes?: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  iterations?: IRepairIteration[];
  totalCost: number;
  administrativeExpenses: number;
  billingAmount?: number | null;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  assignedTo?: mongoose.Types.ObjectId;
  reportDetails?: string;
  invoiceSent: boolean;
  invoiceSentAt?: Date;
  mechanicSalary: number;
  createdAt: Date;
  updatedAt: Date;
}

const repairRequestSchema = new Schema<IRepairRequest>(
  {
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: 'Workshop',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
    },
    requestedDate: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    iterations: [repairIterationSchema],
    totalCost: {
      type: Number,
      default: 0,
    },
    administrativeExpenses: {
      type: Number,
      default: 0,
    },
    billingAmount: {
      type: Number,
      default: null,
    },
    estimatedCompletionDate: Date,
    actualCompletionDate: Date,
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reportDetails: {
      type: String,
    },
    invoiceSent: {
      type: Boolean,
      default: false,
    },
    invoiceSentAt: {
      type: Date,
    },
    mechanicSalary: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

repairRequestSchema.pre('save', function (next) {
  try {
    if (this.iterations && this.iterations.length > 0) {
      this.totalCost = this.iterations.reduce((total, iteration) => {
        const partsCost =
          iteration.cost?.parts?.reduce((sum, part) => sum + ((part.price || 0) * (part.quantity || 0)), 0) || 0;
        const laborCost = iteration.cost?.labor || 0;
        const explicitTotal = iteration.cost?.total;
        const iterationTotal = typeof explicitTotal === 'number' ? explicitTotal : partsCost + laborCost;
        return total + iterationTotal;
      }, 0);
    }
    next();
  } catch (error: any) {
    console.error('Error in repairRequest pre-save hook:', error);
    next(error);
  }
});

export const RepairRequest = mongoose.model<IRepairRequest>('RepairRequest', repairRequestSchema);
