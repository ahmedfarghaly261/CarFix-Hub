import { User, IUser } from '../models/user.model.js';
import { RepairRequest, IRepairRequest } from '../models/repairRequest.model.js';
import { Review, IReview } from '../models/review.model.js';
import { ApiError } from '../utils/apiError.js';

export class UserService {
  static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  static async updateProfile(userId: string, data: any): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.name = data.name || user.name;
    user.email = data.email || user.email;
    user.phone = data.phone || user.phone;
    user.address = data.address || user.address;
    user.city = data.city || user.city;
    user.bio = data.bio || user.bio;
    
    if (data.password) {
      user.password = data.password;
    }

    const updatedUser = await user.save();
    return updatedUser;
  }

  static async getAllUsers(): Promise<IUser[]> {
    return User.find({}).select('-password');
  }

  static async getCompletedRepairs(userId: string): Promise<IRepairRequest[]> {
    return RepairRequest.find({
      userId,
      status: 'completed',
    })
      .populate('carId', 'make model year plate')
      .populate('assignedTo', 'name rating')
      .populate('workshopId', 'name address phone')
      .sort({ actualCompletionDate: -1 });
  }

  static async getRepairsHistory(userId: string, carId: string): Promise<IRepairRequest[]> {
    return RepairRequest.find({
      userId,
      carId,
    })
      .populate('assignedTo', 'name rating')
      .populate('workshopId', 'name address phone')
      .populate('carId', 'make model year plate')
      .sort({ createdAt: -1 });
  }

  static async submitReview(userId: string, data: any): Promise<IReview> {
    const { repairRequestId, rating, comment, workQuality, timeliness, communication } = data;

    const repair = await RepairRequest.findById(repairRequestId);
    if (!repair) {
      throw new ApiError(404, 'Repair request not found');
    }

    if (repair.status !== 'completed') {
      throw new ApiError(400, 'Can only review completed repairs');
    }

    const existingReview = await Review.findOne({ repairRequestId });
    if (existingReview) {
      throw new ApiError(400, 'Review already exists for this repair');
    }

    const review = await Review.create({
      repairRequestId,
      mechanicId: repair.assignedTo,
      userId,
      rating,
      comment,
      workQuality: workQuality || rating,
      timeliness: timeliness || rating,
      communication: communication || rating,
    });

    const mechanic = await User.findById(repair.assignedTo);
    if (mechanic) {
      const allReviews = await Review.find({ mechanicId: repair.assignedTo });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      mechanic.rating = Math.round(avgRating * 10) / 10;
      await mechanic.save();
    }

    return review;
  }

  static async getRepairDetails(userId: string, repairId: string) {
    const repair = await RepairRequest.findById(repairId)
      .populate('carId')
      .populate('assignedTo', 'name rating profileImage')
      .populate('userId');

    if (!repair) {
      throw new ApiError(404, 'Repair not found');
    }

    if (repair.userId._id.toString() !== userId) {
      throw new ApiError(403, 'Not authorized');
    }

    const review = await Review.findOne({ repairRequestId: repairId });

    return {
      repair,
      review,
      hasReview: !!review,
    };
  }
}
