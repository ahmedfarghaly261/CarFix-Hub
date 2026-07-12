import { Request, Response } from 'express';
import { CarService } from '../services/car.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class CarController {
  static getCars = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const cars = await CarService.getCars(
      req.user._id.toString(),
      req.user.role,
      req.query.userId as string
    );
    res.json(cars);
  });

  static getCar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const car = await CarService.getCarById(req.params.id as string, req.user._id.toString(), req.user.role);
    res.json(car);
  });

  static addCar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const car = await CarService.addCar(req.user._id.toString(), req.body);
    res.status(201).json(car);
  });

  static updateCar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const car = await CarService.updateCar(
      req.params.id as string,
      req.user._id.toString(),
      req.user.role,
      req.body
    );
    res.json(car);
  });

  static deleteCar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    await CarService.deleteCar(req.params.id as string, req.user._id.toString(), req.user.role);
    res.json({ message: 'Car deleted successfully' });
  });
}
