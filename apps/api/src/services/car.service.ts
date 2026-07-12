import { Car, ICar } from '../models/car.model.js';
import { ApiError } from '../utils/apiError.js';

export class CarService {
  static async getCars(userId: string, role: string, queryUserId?: string): Promise<ICar[]> {
    let query: any = { userId };
    
    if (role === 'admin' && queryUserId) {
      query = { userId: queryUserId };
    }
    
    return Car.find(query);
  }

  static async getCarById(carId: string, userId: string, role: string): Promise<ICar> {
    const car = await Car.findById(carId);
    if (!car) {
      throw new ApiError(404, 'Car not found');
    }
    if (car.userId.toString() !== userId && role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }
    return car;
  }

  static async addCar(userId: string, data: any): Promise<ICar> {
    const car = new Car({
      userId,
      make: data.make,
      model: data.model,
      year: data.year,
      color: data.color,
      vin: data.vin,
      licensePlate: data.licensePlate,
      mileage: data.mileage || 0,
      fuelType: data.fuelType,
      transmission: data.transmission,
    });

    return car.save();
  }

  static async updateCar(carId: string, userId: string, role: string, data: any): Promise<ICar> {
    const car = await Car.findById(carId);
    if (!car) {
      throw new ApiError(404, 'Car not found');
    }
    if (car.userId.toString() !== userId && role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }

    car.make = data.make || car.make;
    car.model = data.model || car.model;
    car.year = data.year || car.year;
    car.color = data.color || car.color;
    car.vin = data.vin || car.vin;
    car.licensePlate = data.licensePlate || car.licensePlate;
    car.mileage = data.mileage !== undefined ? data.mileage : car.mileage;
    car.fuelType = data.fuelType || car.fuelType;
    car.transmission = data.transmission || car.transmission;

    return car.save();
  }

  static async deleteCar(carId: string, userId: string, role: string): Promise<void> {
    const car = await Car.findById(carId);
    if (!car) {
      throw new ApiError(404, 'Car not found');
    }
    if (car.userId.toString() !== userId && role !== 'admin') {
      throw new ApiError(403, 'Not authorized');
    }

    await car.deleteOne();
  }
}
