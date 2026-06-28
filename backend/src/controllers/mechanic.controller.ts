import { Request, Response } from 'express';
import { MechanicService } from '../services/mechanic.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { RepairRequest } from '../models/repairRequest.model.js';
import { User } from '../models/user.model.js';

export class MechanicController {
  static getDashboard = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const dashboard = await MechanicService.getDashboard(req.user);
    res.json(dashboard);
  });

  static getJobs = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const jobs = await MechanicService.getJobs(req.user);
    res.json(jobs);
  });

  static getJobById = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const job = await MechanicService.getJobById(req.params.id as string, req.user);
    res.json(job);
  });

  static getAppointments = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const appointments = await MechanicService.getAppointments(req.user);
    res.json(appointments);
  });

  static getInProgressJobs = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const jobs = await MechanicService.getInProgressJobs(req.user);
    res.json(jobs);
  });

  static getCompletedJobs = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const jobs = await MechanicService.getCompletedJobs(req.user);
    res.json(jobs);
  });

  static startJob = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const job = await MechanicService.startJob(req.params.id as string, req.user);
    res.json(job);
  });

  static sendUpdate = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    await MechanicService.sendUpdate(req.params.id as string, req.body.message, req.user);
    res.json({ message: 'Update sent successfully' });
  });

  static addWorkReport = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const job = await MechanicService.addWorkReport(req.params.id as string, req.body, req.user);
    res.json({ message: 'Report added successfully', job });
  });

  static completeJob = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const job = await MechanicService.completeJob(req.params.id as string, req.body, req.user);
    res.json(job);
  });

  static getReviews = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const reviews = await MechanicService.getReviews(req.user);
    res.json(reviews);
  });

  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const profile = await User.findById(req.user._id).select('-password');
    res.json(profile);
  });

  static updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const profile = await MechanicService.updateProfile(req.user, req.body);
    res.json(profile);
  });

  static updateSettings = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const settings = await MechanicService.updateSettings(req.user, req.body);
    res.json(settings);
  });

  // Diagnostic endpoints
  static debugStatus = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const mechanic = await User.findById(req.user._id).select('-password');
    const allRequests = await RepairRequest.find().select('_id title status assignedTo workshopId userId');
    const myJobs = await RepairRequest.find({
      $or: [{ assignedTo: req.user._id }, { workshopId: req.user.workshopId }]
    }).select('_id title status assignedTo workshopId userId');

    res.json({
      mechanic,
      totalRequestsInDB: allRequests.length,
      allRequests,
      myJobsCount: myJobs.length,
      myJobs
    });
  });

  static debugAllRequests = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const allRequests = await RepairRequest.find();
    const myJobs = await RepairRequest.find({
      $or: [{ assignedTo: req.user._id }, { workshopId: req.user.workshopId }]
    });

    res.json({
      mechanic: { _id: req.user._id, name: req.user.name, workshopId: req.user.workshopId },
      allRequestsCount: allRequests.length,
      allRequests,
      myJobsCount: myJobs.length,
      myJobs
    });
  });

  static debugSimple = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const allJobs = await RepairRequest.find({}).select('_id title status assignedTo workshopId').limit(5);
    const myJobs = await RepairRequest.find({
      $or: [{ assignedTo: req.user._id }, { workshopId: req.user.workshopId }]
    }).select('_id title status assignedTo workshopId');

    res.json({
      userId: req.user._id,
      userWorkshopId: req.user.workshopId,
      jobsFound: myJobs.length,
      jobs: myJobs,
      allJobsSample: allJobs
    });
  });
}
