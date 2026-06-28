import { User } from '../models/user.model.js';
import { RepairRequest } from '../models/repairRequest.model.js';
import { Car } from '../models/car.model.js';
import { Workshop } from '../models/workshop.model.js';
import { Service } from '../models/service.model.js';
import { Notification } from '../models/notification.model.js';
import { Review } from '../models/review.model.js';
import { ApiError } from '../utils/apiError.js';

export class AdminService {
  static async getDashboard() {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMechanics = await User.countDocuments({ role: 'mechanic' });
    const totalRequests = await RepairRequest.countDocuments();
    const pendingRequests = await RepairRequest.countDocuments({ status: 'pending' });
    const inProgressRequests = await RepairRequest.countDocuments({ status: 'in-progress' });
    const completedRequests = await RepairRequest.countDocuments({ status: 'completed' });

    return { totalUsers, totalMechanics, totalRequests, pendingRequests, inProgressRequests, completedRequests };
  }

  static async getUsers() {
    return User.find({ role: 'user' }).select('-password');
  }

  static async getUserById(id: string) {
    const user = await User.findById(id).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  static async updateUser(id: string, data: any) {
    const user = await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  static async deleteUser(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new ApiError(404, 'User not found');
  }

  static async getMechanics() {
    return User.find({ role: 'mechanic' }).select('-password');
  }

  static async getMechanicById(id: string) {
    const mechanic = await User.findById(id).select('-password');
    if (!mechanic) throw new ApiError(404, 'Mechanic not found');
    return mechanic;
  }

  static async createMechanic(data: any) {
    const mechanic = await User.create({ ...data, role: 'mechanic' });

    if (data.workshopId) {
      await Workshop.findByIdAndUpdate(
        data.workshopId,
        { $addToSet: { mechanics: mechanic._id } },
        { new: true }
      );
    }
    return mechanic;
  }

  static async updateMechanic(id: string, data: any) {
    const mechanic = await User.findById(id);
    if (!mechanic) throw new ApiError(404, 'Mechanic not found');

    const oldWorkshopId = mechanic.workshopId;
    const newWorkshopId = data.workshopId;

    if (oldWorkshopId && newWorkshopId && oldWorkshopId.toString() !== newWorkshopId.toString()) {
      await Workshop.findByIdAndUpdate(oldWorkshopId, { $pull: { mechanics: mechanic._id } });
      await Workshop.findByIdAndUpdate(newWorkshopId, { $addToSet: { mechanics: mechanic._id } });
    } else if (!oldWorkshopId && newWorkshopId) {
      await Workshop.findByIdAndUpdate(newWorkshopId, { $addToSet: { mechanics: mechanic._id } });
    } else if (oldWorkshopId && !newWorkshopId) {
      await Workshop.findByIdAndUpdate(oldWorkshopId, { $pull: { mechanics: mechanic._id } });
    }

    return User.findByIdAndUpdate(id, data, { new: true }).select('-password');
  }

  static async deleteMechanic(id: string) {
    const mechanic = await User.findByIdAndDelete(id);
    if (!mechanic) throw new ApiError(404, 'Mechanic not found');

    if (mechanic.workshopId) {
      await Workshop.findByIdAndUpdate(mechanic.workshopId, { $pull: { mechanics: mechanic._id } });
    }
  }

  static async getBookings() {
    return RepairRequest.find()
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year')
      .populate('workshopId', 'name')
      .sort({ createdAt: -1 });
  }

  static async getBookingById(id: string) {
    const booking = await RepairRequest.findById(id)
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year')
      .populate('workshopId', 'name');
    if (!booking) throw new ApiError(404, 'Booking not found');
    return booking;
  }

  static async updateBooking(id: string, data: any) {
    const booking = await RepairRequest.findByIdAndUpdate(id, data, { new: true });
    if (!booking) throw new ApiError(404, 'Booking not found');
    return booking;
  }

  static async getServices() {
    return Service.find({ isActive: true }).sort({ createdAt: -1 });
  }

  static async getServiceById(id: string) {
    const service = await Service.findById(id);
    if (!service) throw new ApiError(404, 'Service not found');
    return service;
  }

  static async createService(data: any) {
    if (!data.name || !data.price || !data.duration) {
      throw new ApiError(400, 'Name, price, and duration are required');
    }

    const existingService = await Service.findOne({ name: data.name });
    if (existingService) {
      throw new ApiError(400, `Service with name "${data.name}" already exists`);
    }

    return Service.create(data);
  }

  static async updateService(id: string, data: any) {
    const existingService = await Service.findById(id);
    if (!existingService) throw new ApiError(404, 'Service not found');

    if (data.name && data.name !== existingService.name) {
      const duplicateService = await Service.findOne({ name: data.name });
      if (duplicateService) {
        throw new ApiError(400, `Service with name "${data.name}" already exists`);
      }
    }

    return Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  static async deleteService(id: string) {
    const service = await Service.findByIdAndDelete(id);
    if (!service) throw new ApiError(404, 'Service not found');
  }

  static async getReviews() {
    return Review.find()
      .populate({ path: 'userId', select: 'name email phone', model: 'User' })
      .populate({ path: 'mechanicId', select: 'name email rating', model: 'User' })
      .populate({ path: 'repairRequestId', select: 'title description status completedAt', model: 'RepairRequest' })
      .sort({ createdAt: -1 })
      .lean();
  }

  static async deleteReview(id: string) {
    const review = await Review.findByIdAndDelete(id);
    if (!review) throw new ApiError(404, 'Review not found');
  }

  static async fixMissingReviewData() {
    const allReviews = await Review.find();
    let fixed = 0;
    let errors: any[] = [];

    for (const review of allReviews) {
      try {
        let needsUpdate = false;

        if (!review.userId) {
          const repair = await RepairRequest.findById(review.repairRequestId);
          if (repair && repair.userId) {
            review.userId = repair.userId;
            needsUpdate = true;
          }
        }

        if (!review.mechanicId) {
          const repair = await RepairRequest.findById(review.repairRequestId);
          if (repair && repair.assignedTo) {
            review.mechanicId = repair.assignedTo;
            needsUpdate = true;
          }
        }

        if (review.rating === undefined || review.rating === null) {
          review.rating = 0;
          needsUpdate = true;
        }

        if (!review.comment) {
          review.comment = '';
          needsUpdate = true;
        }

        if (needsUpdate) {
          await review.save();
          fixed++;
        }
      } catch (error: any) {
        errors.push({ reviewId: review._id, error: error.message });
      }
    }

    return { fixed, errors };
  }

  static async getJobs() {
    return RepairRequest.find()
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
      .populate('workshopId', 'name address')
      .populate('assignedTo', 'name email phone specializations')
      .sort({ createdAt: -1 });
  }

  static async getJobById(id: string) {
    const job = await RepairRequest.findById(id)
      .populate('userId', 'name email phone address city')
      .populate('carId', 'make model year licensePlate mileage')
      .populate('workshopId', 'name address phone')
      .populate('assignedTo', 'name email phone specializations rating');
    if (!job) throw new ApiError(404, 'Job not found');
    return job;
  }

  static async sendInvoice(id: string, amount: any) {
    const job = await RepairRequest.findById(id).populate('userId', 'name email');
    if (!job) throw new ApiError(404, 'Job not found');

    if (amount != null) {
      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        throw new ApiError(400, 'Valid invoice amount is required');
      }
      job.billingAmount = parsedAmount;
    }

    job.invoiceSent = true;
    job.invoiceSentAt = new Date();
    await job.save();

    const invoiceAmount = job.billingAmount ?? job.totalCost;

    try {
      await Notification.create({
        recipient: (job.userId as any)._id,
        type: 'invoice',
        title: 'Invoice Received',
        message: `An invoice of $${invoiceAmount} has been sent for your repair "${job.title}"`,
        relatedTo: { model: 'RepairRequest', id: job._id }
      });
    } catch (e) {}

    return job;
  }

  static async updateSalary(id: string, salary: any) {
    if (salary == null || salary < 0) throw new ApiError(400, 'Valid salary amount is required');

    const job = await RepairRequest.findById(id);
    if (!job) throw new ApiError(404, 'Job not found');

    job.mechanicSalary = salary;
    await job.save();
    return job;
  }

  static async getReports() {
    const totalRevenue = await RepairRequest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]);
    const requestsByStatus = await RepairRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const requestsByPriority = await RepairRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    return {
      totalRevenue: totalRevenue[0]?.total || 0,
      requestsByStatus,
      requestsByPriority
    };
  }

  static async fixAssignments() {
    const defaultWorkshop = await Workshop.findOne().select('_id');
    if (!defaultWorkshop) throw new ApiError(400, 'No workshop found in system');

    const result = await RepairRequest.updateMany(
      { $or: [{ assignedTo: null }, { workshopId: null }] },
      { $set: { workshopId: defaultWorkshop._id } }
    );

    return { modifiedCount: result.modifiedCount, defaultWorkshop: defaultWorkshop._id };
  }
}
