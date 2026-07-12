import { Request, Response } from 'express';
import { RepairService } from '../services/repair.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class RepairController {
  static getRepairs = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repairs = await RepairService.getRepairs(req.user, req.query.userId as string);
    res.json(repairs);
  });

  static getRepairById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repair = await RepairService.getRepairById(req.params.id as string, req.user);
    res.json(repair);
  });

  static createRepair = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repair = await RepairService.createRepair(req.user, req.body);
    res.status(201).json(repair);
  });

  static addIteration = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repair = await RepairService.addIteration(req.params.id as string, req.user, req.body);
    res.json(repair);
  });

  static updateRepair = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repair = await RepairService.updateRepair(req.params.id as string, req.user, req.body);
    res.json(repair);
  });

  static deleteRepair = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    await RepairService.deleteRepair(req.params.id as string, req.user);
    res.json({ message: 'Repair request deleted successfully' });
  });
}
