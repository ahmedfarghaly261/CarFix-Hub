import { RepairRequest, IRepairRequest } from '../models/repairRequest.model.js';
import { User, IUser } from '../models/user.model.js';
import { Review, IReview } from '../models/review.model.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/apiError.js';

export class MechanicService {
  static async getDashboard(user: any) {
    const totalJobs = await RepairRequest.countDocuments({ workshopId: user.workshopId });
    const pendingJobs = await RepairRequest.countDocuments({ workshopId: user.workshopId, status: 'pending' });
    const inProgressJobs = await RepairRequest.countDocuments({ workshopId: user.workshopId, status: 'in-progress' });
    const completedJobs = await RepairRequest.countDocuments({ workshopId: user.workshopId, status: 'completed' });

    return { totalJobs, pendingJobs, inProgressJobs, completedJobs };
  }

  static async getJobs(user: any) {
    return RepairRequest.find({
      $or: [
        { assignedTo: user._id },
        { workshopId: user.workshopId }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
      .populate('workshopId', 'name address phone')
      .sort({ createdAt: -1 });
  }

  static async getJobById(jobId: string, user: any) {
    const job = await RepairRequest.findById(jobId)
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate mileage')
      .populate('workshopId', 'name address phone');

    if (!job) throw new ApiError(404, 'Job not found');

    if (job.workshopId?.toString() !== user.workshopId?.toString()) {
      throw new ApiError(403, 'Not authorized');
    }

    return job;
  }

  static async getAppointments(user: any) {
    return RepairRequest.find({
      $or: [
        { assignedTo: user._id, status: { $in: ['pending', 'assigned'] } },
        { workshopId: user.workshopId, status: { $in: ['pending', 'assigned'] } }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
      .sort({ estimatedCompletionDate: 1 });
  }

  static async getInProgressJobs(user: any) {
    return RepairRequest.find({
      $or: [
        { assignedTo: user._id, status: 'in-progress' },
        { workshopId: user.workshopId, status: 'in-progress' }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate');
  }

  static async getCompletedJobs(user: any) {
    return RepairRequest.find({
      $or: [
        { assignedTo: user._id, status: 'completed' },
        { workshopId: user.workshopId, status: 'completed' }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
      .sort({ actualCompletionDate: -1 });
  }

  static async startJob(jobId: string, user: any) {
    if (!user.workshopId) {
      throw new ApiError(403, 'You must be assigned to a workshop to work on jobs');
    }

    const job = await RepairRequest.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');

    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === user.workshopId.toString();
    const isUnassignedJob = !job.workshopId && !job.assignedTo;

    if (!isAssignedToMechanic && !isInSameWorkshop && !isUnassignedJob) {
      throw new ApiError(403, 'Not authorized for this job');
    }

    if (!job.workshopId) {
      job.workshopId = user.workshopId;
    }

    job.status = 'in-progress';
    await job.save();

    try {
      await Notification.create({
        recipient: job.userId,
        type: 'status_change',
        title: 'Work Started',
        message: `Your repair request "${job.title}" has been started`,
        relatedTo: { model: 'RepairRequest', id: job._id }
      });
    } catch (e) {}

    return job;
  }

  static async sendUpdate(jobId: string, message: string, user: any) {
    if (!user.workshopId) throw new ApiError(403, 'You must be assigned to a workshop to work on jobs');

    const job = await RepairRequest.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');

    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === user.workshopId.toString();

    if (!isAssignedToMechanic && !isInSameWorkshop) throw new ApiError(403, 'Not authorized');

    if (!job.workshopId) {
      job.workshopId = user.workshopId;
      await job.save();
    }

    try {
      await Notification.create({
        recipient: job.userId,
        type: 'repair_update',
        title: 'Work Update',
        message: message,
        relatedTo: { model: 'RepairRequest', id: job._id }
      });
    } catch (e) {}
  }

  static async addWorkReport(jobId: string, data: any, user: any) {
    if (!user.workshopId) throw new ApiError(403, 'You must be assigned to a workshop to work on jobs');

    const job = await RepairRequest.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');

    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === user.workshopId.toString();

    if (!isAssignedToMechanic && !isInSameWorkshop) throw new ApiError(403, 'Not authorized');

    if (!job.workshopId) job.workshopId = user.workshopId;

    if (data.reportDetails) job.reportDetails = data.reportDetails;

    const hasRepairItem = typeof data.repairItem === 'string' && data.repairItem.trim() !== '';
    const hasRepairAmount = data.repairAmount != null && data.repairAmount !== '';

    if (hasRepairItem || hasRepairAmount) {
      const parsedAmount = Number(data.repairAmount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        throw new ApiError(400, 'Valid repair amount is required');
      }

      job.iterations?.push({
        description: hasRepairItem ? data.repairItem.trim() : 'Repair work',
        mechanicNotes: data.reportDetails || '',
        status: 'completed',
        cost: { total: parsedAmount },
        mechanicId: user._id,
        completedAt: new Date()
      } as any);
    }

    await job.save();
    return job;
  }

  static async completeJob(jobId: string, data: any, user: any) {
    if (!user.workshopId) throw new ApiError(403, 'You must be assigned to a workshop to work on jobs');

    const job = await RepairRequest.findById(jobId);
    if (!job) throw new ApiError(404, 'Job not found');

    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === user.workshopId.toString();

    if (!isAssignedToMechanic && !isInSameWorkshop) throw new ApiError(403, 'Not authorized');

    if (!job.workshopId) job.workshopId = user.workshopId;
    if (data.reportDetails) job.reportDetails = data.reportDetails;

    const hasRepairItem = typeof data.repairItem === 'string' && data.repairItem.trim() !== '';
    const hasRepairAmount = data.repairAmount != null && data.repairAmount !== '';

    if (hasRepairItem || hasRepairAmount) {
      const parsedAmount = Number(data.repairAmount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        throw new ApiError(400, 'Valid repair amount is required');
      }

      job.iterations?.push({
        description: hasRepairItem ? data.repairItem.trim() : 'Repair work',
        mechanicNotes: data.reportDetails || data.notes || '',
        status: 'completed',
        cost: { total: parsedAmount },
        mechanicId: user._id,
        completedAt: new Date()
      } as any);
    }

    job.status = 'completed';
    job.actualCompletionDate = new Date();
    if (data.cost) job.totalCost = data.cost;
    await job.save();

    await User.findByIdAndUpdate(user._id, { $inc: { completedJobs: 1 } });

    try {
      await Notification.create({
        recipient: job.userId,
        type: 'status_change',
        title: 'Work Completed',
        message: `Your repair request "${job.title}" has been completed`,
        relatedTo: { model: 'RepairRequest', id: job._id }
      });
    } catch (e) {}

    try {
      const admins = await User.find({ role: 'admin' }).select('_id');
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          type: 'job_completed',
          title: 'Job Completed',
          message: `Mechanic "${user.name}" has completed the job "${job.title}"`,
          relatedTo: { model: 'RepairRequest', id: job._id }
        });
      }
    } catch (e) {}

    return job;
  }

  static async getReviews(user: any) {
    const mechanic = await User.findById(user._id).select('name rating completedJobs totalJobs');
    const reviews = await Review.find({ mechanicId: user._id })
      .populate('userId', 'name')
      .populate('repairRequestId', 'title')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    return { mechanic, reviews, totalReviews: reviews.length, averageRating };
  }

  static async updateProfile(user: any, data: any) {
    const profile = await User.findByIdAndUpdate(user._id, {
      name: data.name,
      phone: data.phone,
      bio: data.bio,
      specializations: data.specializations,
      workHours: data.workHours,
      address: data.address,
      city: data.city
    }, { new: true }).select('-password');
    return profile;
  }

  static async updateSettings(user: any, data: any) {
    const settings = await User.findByIdAndUpdate(user._id, {
      workHours: data.workHours,
      specializations: data.specializations
    }, { new: true }).select('-password');
    return settings;
  }
}
