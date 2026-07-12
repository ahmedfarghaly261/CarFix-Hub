import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class UserController {
  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    // The protect middleware should populate req.user, but we can fetch it fully via service
    res.json(req.user);
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const updatedUser = await UserService.updateProfile(req.user._id.toString(), req.body);
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      bio: updatedUser.bio,
      role: updatedUser.role,
    });
  });

  static getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.json(users);
  });

  static getCompletedRepairs = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repairs = await UserService.getCompletedRepairs(req.user._id.toString());
    res.json(repairs);
  });

  static getRepairsHistory = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const repairs = await UserService.getRepairsHistory((req.user as any)._id.toString(), req.params.carId as string);
    res.json(repairs);
  });

  static submitReview = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const review = await UserService.submitReview(req.user._id.toString(), req.body);
    res.status(201).json({ message: 'Review submitted successfully', review });
  });

  static getRepairDetails = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const details = await UserService.getRepairDetails(req.user._id.toString(), req.params.id as string);
    res.json(details);
  });
}
