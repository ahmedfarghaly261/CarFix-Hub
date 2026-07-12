import { Router } from 'express';
import userRoutes from './user.routes.js';
import carRoutes from './car.routes.js';
import repairRoutes from './repair.routes.js';
import workshopRoutes from './workshop.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';
import mechanicRoutes from './mechanic.routes.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/cars', protect, carRoutes);
router.use('/repairs', protect, repairRoutes);
router.use('/workshops', protect, workshopRoutes);
router.use('/notifications', protect, notificationRoutes);
router.use('/admin', protect, adminRoutes);
router.use('/mechanics', protect, mechanicRoutes);

export default router;
