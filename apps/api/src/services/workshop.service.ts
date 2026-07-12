import { Workshop, IWorkshop } from '../models/workshop.model.js';
import { ApiError } from '../utils/apiError.js';

export class WorkshopService {
  static async getAllWorkshops(): Promise<IWorkshop[]> {
    return Workshop.find({ isActive: true }).populate('mechanics', 'name email');
  }

  static async getWorkshopById(workshopId: string): Promise<IWorkshop> {
    const workshop = await Workshop.findById(workshopId).populate('mechanics', 'name email');
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found');
    }
    return workshop;
  }

  static async createWorkshop(data: any): Promise<IWorkshop> {
    const workshop = await Workshop.create({
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      specializations: data.specializations,
      operatingHours: data.operatingHours,
    });
    return workshop;
  }

  static async updateWorkshop(workshopId: string, data: any): Promise<IWorkshop> {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found');
    }

    const updates = Object.keys(data);
    const allowedUpdates = [
      'name', 'address', 'phone', 'email', 
      'specializations', 'operatingHours', 'isActive'
    ];

    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        (workshop as any)[update] = data[update];
      }
    });

    return workshop.save();
  }

  static async addMechanic(workshopId: string, mechanicId: string): Promise<IWorkshop> {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found');
    }

    if (!workshop.mechanics?.includes(mechanicId as any)) {
      workshop.mechanics?.push(mechanicId as any);
      await workshop.save();
    }
    return workshop;
  }

  static async removeMechanic(workshopId: string, mechanicId: string): Promise<IWorkshop> {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found');
    }

    workshop.mechanics = workshop.mechanics?.filter(
      (mechanic) => mechanic.toString() !== mechanicId
    );
    return workshop.save();
  }

  static async getWorkshopStats(workshopId: string): Promise<any> {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      throw new ApiError(404, 'Workshop not found');
    }

    return {
      totalRepairs: 0,
      completedRepairs: 0,
      averageRating: workshop.rating?.average || 0,
      totalRevenue: 0,
    };
  }
}
