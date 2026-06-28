import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AdminController {
  static getDashboard = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getDashboard());
  });

  static getUsers = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getUsers());
  });

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getUserById(req.params.id as string));
  });

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.updateUser(req.params.id as string, req.body));
  });

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteUser(req.params.id as string);
    res.json({ message: 'User deleted successfully' });
  });

  static getMechanics = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getMechanics());
  });

  static getMechanicById = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getMechanicById(req.params.id as string));
  });

  static createMechanic = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await AdminService.createMechanic(req.body));
  });

  static updateMechanic = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.updateMechanic(req.params.id as string, req.body));
  });

  static deleteMechanic = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteMechanic(req.params.id as string);
    res.json({ message: 'Mechanic deleted successfully' });
  });

  static getBookings = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getBookings());
  });

  static getBookingById = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getBookingById(req.params.id as string));
  });

  static updateBooking = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.updateBooking(req.params.id as string, req.body));
  });

  static getServices = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getServices());
  });

  static getServiceById = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getServiceById(req.params.id as string));
  });

  static createService = asyncHandler(async (req: Request, res: Response) => {
    res.status(201).json(await AdminService.createService(req.body));
  });

  static updateService = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.updateService(req.params.id as string, req.body));
  });

  static deleteService = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteService(req.params.id as string);
    res.json({ message: 'Service deleted successfully' });
  });

  static getReviews = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getReviews());
  });

  static deleteReview = asyncHandler(async (req: Request, res: Response) => {
    await AdminService.deleteReview(req.params.id as string);
    res.json({ message: 'Review deleted successfully' });
  });

  static fixMissingReviewData = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.fixMissingReviewData();
    res.json({
      message: `Fixed ${result.fixed} reviews with missing data`,
      fixedCount: result.fixed,
      errors: result.errors,
    });
  });

  static getJobs = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getJobs());
  });

  static getJobById = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getJobById(req.params.id as string));
  });

  static sendInvoice = asyncHandler(async (req: Request, res: Response) => {
    const job = await AdminService.sendInvoice(req.params.id as string, req.body.amount);
    res.json({ message: 'Invoice sent successfully', job });
  });

  static updateSalary = asyncHandler(async (req: Request, res: Response) => {
    const job = await AdminService.updateSalary(req.params.id as string, req.body.mechanicSalary);
    res.json({ message: 'Salary updated successfully', job });
  });

  static getReports = asyncHandler(async (req: Request, res: Response) => {
    res.json(await AdminService.getReports());
  });

  static fixAssignments = asyncHandler(async (req: Request, res: Response) => {
    const result = await AdminService.fixAssignments();
    res.json({
      message: 'Data migration completed',
      modifiedCount: result.modifiedCount,
      defaultWorkshop: result.defaultWorkshop,
    });
  });
}
