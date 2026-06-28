import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'mechanic' | 'admin';
  phone?: string;
  
  // Mechanic-specific fields
  specializations?: string[];
  workHours?: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  workshopId?: mongoose.Types.ObjectId;
  rating?: number;
  totalJobs?: number;
  completedJobs?: number;
  
  // Profile
  profileImage?: string;
  bio?: string;
  address?: string;
  city?: string;

  createdAt: Date;
  updatedAt: Date;
  
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'mechanic', 'admin'],
      default: 'user',
    },
    phone: { type: String },
    
    // Mechanic-specific fields
    specializations: [String],
    workHours: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String }
    },
    workshopId: {
      type: Schema.Types.ObjectId,
      ref: 'Workshop'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalJobs: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    
    // Profile
    profileImage: String,
    bio: String,
    address: String,
    city: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
