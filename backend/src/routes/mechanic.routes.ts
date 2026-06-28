import { Router, Request, Response, NextFunction } from 'express';
import { MechanicController } from '../controllers/mechanic.controller.js';

const router = Router();

// Middleware to check if user is mechanic
const mechanicOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'mechanic') {
    return res.status(403).json({ message: 'Mechanic access required' });
  }
  next();
};

router.use(mechanicOnly);

router.get('/dashboard', MechanicController.getDashboard);
router.get('/jobs', MechanicController.getJobs);
router.get('/jobs/:id', MechanicController.getJobById);
router.get('/appointments', MechanicController.getAppointments);
router.get('/in-progress', MechanicController.getInProgressJobs);
router.get('/completed', MechanicController.getCompletedJobs);
router.put('/jobs/:id/start', MechanicController.startJob);
router.post('/jobs/:id/update', MechanicController.sendUpdate);
router.put('/jobs/:id/update', MechanicController.addWorkReport);
router.put('/jobs/:id/complete', MechanicController.completeJob);
router.get('/reviews', MechanicController.getReviews);
router.get('/profile', MechanicController.getProfile);
router.put('/profile', MechanicController.updateProfile);
router.put('/settings', MechanicController.updateSettings);

// Diagnostic endpoints
router.get('/debug/status', MechanicController.debugStatus);
router.get('/debug/all-requests', MechanicController.debugAllRequests);
router.get('/debug/simple', MechanicController.debugSimple);

export default router;
