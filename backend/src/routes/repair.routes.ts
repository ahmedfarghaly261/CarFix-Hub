import { Router } from 'express';
import { RepairController } from '../controllers/repair.controller.js';

const router = Router();

router.get('/', RepairController.getRepairs);
router.post('/', RepairController.createRepair);
router.get('/:id', RepairController.getRepairById);
router.put('/:id', RepairController.updateRepair);
router.delete('/:id', RepairController.deleteRepair);
router.post('/:id/iterations', RepairController.addIteration);

export default router;
