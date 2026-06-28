import { Router, Request, Response, NextFunction } from 'express';
import { AdminController } from '../controllers/admin.controller.js';

const router = Router();

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Some routes like getServices and getServiceById are open in the original, but placed inside adminRoutes.
// Wait, the original adminRoutes.js mounts adminOnly mostly on specific routes, but let's check:
// get('/services') and get('/services/:id') do NOT have adminOnly in the original code!
// Let's create an open router and a protected router.

// We will mount this router using app.use('/api/admin', protect, adminRoutes)
// In the original server.js: app.use('/api/admin', protect, adminRoutes);
// Inside adminRoutes.js, some routes do not use the `adminOnly` middleware (like /services).
// TODO: will replicate this exactly by not applying adminOnly globally to the router.

router.get('/dashboard', adminOnly, AdminController.getDashboard);

router.get('/users', adminOnly, AdminController.getUsers);
router.get('/users/:id', adminOnly, AdminController.getUserById);
router.put('/users/:id', adminOnly, AdminController.updateUser);
router.delete('/users/:id', adminOnly, AdminController.deleteUser);

router.get('/mechanics', adminOnly, AdminController.getMechanics);
router.get('/mechanics/:id', adminOnly, AdminController.getMechanicById);
router.post('/mechanics', adminOnly, AdminController.createMechanic);
router.put('/mechanics/:id', adminOnly, AdminController.updateMechanic);
router.delete('/mechanics/:id', adminOnly, AdminController.deleteMechanic);

router.get('/bookings', adminOnly, AdminController.getBookings);
router.get('/bookings/:id', adminOnly, AdminController.getBookingById);
router.put('/bookings/:id', adminOnly, AdminController.updateBooking);

router.get('/services', AdminController.getServices);
router.get('/services/:id', AdminController.getServiceById);
router.post('/services', adminOnly, AdminController.createService);
router.put('/services/:id', adminOnly, AdminController.updateService);
router.delete('/services/:id', adminOnly, AdminController.deleteService);

router.get('/reviews', adminOnly, AdminController.getReviews);
router.delete('/reviews/:id', adminOnly, AdminController.deleteReview);
router.post('/reviews/fix-missing-data', adminOnly, AdminController.fixMissingReviewData);

router.get('/jobs', adminOnly, AdminController.getJobs);
router.get('/jobs/:id', adminOnly, AdminController.getJobById);
router.post('/jobs/:id/send-invoice', adminOnly, AdminController.sendInvoice);
router.put('/jobs/:id/salary', adminOnly, AdminController.updateSalary);

router.get('/reports', adminOnly, AdminController.getReports);
router.post('/migrate/fix-assignments', adminOnly, AdminController.fixAssignments);

export default router;
