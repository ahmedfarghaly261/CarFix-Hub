import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { UserController } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

// Auth Routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

// User Profile
router.get('/profile', protect, UserController.getProfile);
router.put('/profile', protect, UserController.updateProfile);

// Admin Routes (mapped exactly as before)
router.get('/users', protect, authorizeRoles('admin'), UserController.getAllUsers);

// Repair history & reviews
router.get('/completed-repairs', protect, UserController.getCompletedRepairs);
router.get('/repairs-history/:carId', protect, UserController.getRepairsHistory);
router.post('/reviews', protect, UserController.submitReview);
router.get('/repair/:id', protect, UserController.getRepairDetails);

export default router;
