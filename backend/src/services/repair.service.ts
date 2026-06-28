import { RepairRequest, IRepairRequest } from '../models/repairRequest.model.js';
import { User } from '../models/user.model.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/apiError.js';

export class RepairService {
  private static async getRepairAndVerify(repairId: string, user: any): Promise<IRepairRequest> {
    const repair = await RepairRequest.findById(repairId);
    if (!repair) throw new ApiError(404, 'Repair request not found');

    const isOwner = repair.userId.toString() === user._id.toString();
    const isAdmin = user.role === 'admin';
    const isAssignedMechanic = user.role === 'mechanic' &&
                               repair.assignedTo?.toString() === user._id.toString();
    const isWorkshopMechanic = user.role === 'mechanic' &&
                               user.workshopId &&
                               repair.workshopId?.toString() === user.workshopId.toString();

    if (!(isOwner || isAdmin || isAssignedMechanic || isWorkshopMechanic)) {
      throw new ApiError(403, 'Not authorized');
    }

    return repair;
  }

  static async getRepairs(user: any, queryUserId?: string): Promise<IRepairRequest[]> {
    let query: any = {};

    if (user.role === 'user') {
      query.userId = user._id;
    } else if (user.role === 'admin' && queryUserId) {
      query.userId = queryUserId;
    } else if (user.role === 'mechanic') {
      const orConditions: any[] = [];
      orConditions.push({ assignedTo: user._id });
      
      if (user.workshopId) {
        orConditions.push({ workshopId: user.workshopId });
      }

      if (orConditions.length > 0) {
        query.$or = orConditions;
      } else {
        query._id = { $in: [] };
      }
    }

    return RepairRequest.find(query)
      .populate('carId', 'make model year')
      .populate('userId', 'name email')
      .populate('assignedTo', 'name')
      .populate('workshopId', 'name');
  }

  static async getRepairById(repairId: string, user: any): Promise<IRepairRequest> {
    const repair = await this.getRepairAndVerify(repairId, user);
    return repair.populate([
      { path: 'carId', select: 'make model year' },
      { path: 'userId', select: 'name email' },
      { path: 'workshopId', select: 'name' },
      { path: 'iterations.mechanicId', select: 'name' }
    ]);
  }

  static async createRepair(user: any, data: any): Promise<IRepairRequest> {
    if (!data.carId) throw new ApiError(400, 'carId is required');
    if (!data.title) throw new ApiError(400, 'title is required');
    if (!data.description) throw new ApiError(400, 'description is required');

    const repairRequest = await RepairRequest.create({
      carId: data.carId,
      userId: user._id,
      workshopId: data.workshopId,
      title: data.title,
      description: data.description,
      serviceType: data.serviceType,
      requestedDate: data.requestedDate,
      notes: data.notes,
      priority: data.priority || 'medium'
    });

    const populatedRequest = await RepairRequest.findById(repairRequest._id)
      .populate('carId', 'make model year licensePlate')
      .populate('userId', 'name email phone');

    try {
      const admin = await User.findOne({ role: 'admin' });
      if (admin && admin._id) {
        await Notification.create({
          recipient: admin._id,
          title: 'New Appointment Request',
          message: `New appointment request for ${data.title}`,
          type: 'repair_update',
          relatedTo: {
            model: 'RepairRequest',
            id: repairRequest._id
          }
        });
      }
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
    }

    return populatedRequest as IRepairRequest;
  }

  static async addIteration(repairId: string, user: any, data: any): Promise<IRepairRequest> {
    if (user.role !== 'mechanic') {
      throw new ApiError(403, 'Only mechanics can add repair iterations');
    }

    const repair = await this.getRepairAndVerify(repairId, user);

    const iteration = {
      description: data.description,
      mechanicNotes: data.mechanicNotes,
      status: data.status,
      cost: data.cost,
      mechanicId: user._id,
      images: data.images
    };

    repair.iterations?.push(iteration as any);
    repair.status = data.status;
    if (data.status === 'completed') {
      repair.actualCompletionDate = new Date();
    }

    const updatedRequest = await repair.save();

    await Notification.create({
      recipient: repair.userId,
      title: 'Repair Update',
      message: `Your repair request "${repair.title}" has been updated`,
      type: 'repair_update',
      relatedTo: {
        model: 'RepairRequest',
        id: repair._id
      }
    });

    return updatedRequest;
  }

  static async updateRepair(repairId: string, user: any, data: any): Promise<IRepairRequest> {
    const repair = await this.getRepairAndVerify(repairId, user);

    const allowedUpdates = ['title', 'description', 'priority', 'status', 'estimatedCompletionDate', 'assignedTo', 'workshopId'];
    allowedUpdates.forEach(update => {
      if (data[update] !== undefined) {
        (repair as any)[update] = data[update];
      }
    });

    return repair.save();
  }

  static async deleteRepair(repairId: string, user: any): Promise<void> {
    const repair = await this.getRepairAndVerify(repairId, user);

    if (user.role !== 'admin' && repair.status !== 'pending') {
      throw new ApiError(403, 'Can only delete pending repair requests');
    }

    await repair.deleteOne();
  }
}
