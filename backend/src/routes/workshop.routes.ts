import { Router } from 'express';
import { WorkshopController } from '../controllers/workshop.controller.js';
import { authorizeRoles } from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', WorkshopController.getAllWorkshops);
router.get('/:id', WorkshopController.getWorkshopById);
router.post('/', authorizeRoles('admin'), WorkshopController.createWorkshop);
router.put('/:id', authorizeRoles('admin'), WorkshopController.updateWorkshop);
router.post('/:id/mechanics', authorizeRoles('admin'), WorkshopController.addMechanic);
router.delete('/:id/mechanics/:mechanicId', authorizeRoles('admin'), WorkshopController.removeMechanic);
router.get('/:id/stats', WorkshopController.getWorkshopStats);

export default router;
