import { Router } from 'express';
import { CarController } from '../controllers/car.controller.js';

const router = Router();

router.get('/', CarController.getCars);
router.get('/:id', CarController.getCar);
router.post('/', CarController.addCar);
router.put('/:id', CarController.updateCar);
router.delete('/:id', CarController.deleteCar);

export default router;
