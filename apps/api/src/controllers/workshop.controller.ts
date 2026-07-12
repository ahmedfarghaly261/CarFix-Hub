import { Request, Response } from 'express';
import { WorkshopService } from '../services/workshop.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class WorkshopController {
  static getAllWorkshops = asyncHandler(async (req: Request, res: Response) => {
    const workshops = await WorkshopService.getAllWorkshops();
    res.json(workshops);
  });

  static getWorkshopById = asyncHandler(async (req: Request, res: Response) => {
    const workshop = await WorkshopService.getWorkshopById(req.params.id as string);
    res.json(workshop);
  });

  static createWorkshop = asyncHandler(async (req: Request, res: Response) => {
    const workshop = await WorkshopService.createWorkshop(req.body);
    res.status(201).json(workshop);
  });

  static updateWorkshop = asyncHandler(async (req: Request, res: Response) => {
    const workshop = await WorkshopService.updateWorkshop(req.params.id as string, req.body);
    res.json(workshop);
  });

  static addMechanic = asyncHandler(async (req: Request, res: Response) => {
    const workshop = await WorkshopService.addMechanic(req.params.id as string, req.body.mechanicId);
    res.json(workshop);
  });

  static removeMechanic = asyncHandler(async (req: Request, res: Response) => {
    const workshop = await WorkshopService.removeMechanic(req.params.id as string, req.params.mechanicId as string);
    res.json(workshop);
  });

  static getWorkshopStats = asyncHandler(async (req: Request, res: Response) => {
    if (req.user?.role !== 'admin' && req.user?.workshopId?.toString() !== req.params.id as string) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const stats = await WorkshopService.getWorkshopStats(req.params.id as string);
    res.json(stats);
  });
}
