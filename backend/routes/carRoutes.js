const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const User = require('../models/user');

// Middleware to check if user owns the car or is admin
const checkCarOwnership = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    if (car.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    req.car = car;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all cars for the logged-in user
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.user._id });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific car
router.get('/:id', checkCarOwnership, async (req, res) => {
  res.json(req.car);
});

// Add a new car
router.post('/', async (req, res) => {
  try {
    const car = new Car({
      userId: req.user._id,
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      vin: req.body.vin,
      licensePlate: req.body.licensePlate,
      mileage: req.body.mileage || 0,
      fuelType: req.body.fuelType,
      transmission: req.body.transmission
    });

    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a car
router.put('/:id', checkCarOwnership, async (req, res) => {
  try {
    const { make, model, year, color, vin, licensePlate, mileage, fuelType, transmission } = req.body;
    
    req.car.make = make || req.car.make;
    req.car.model = model || req.car.model;
    req.car.year = year || req.car.year;
    req.car.color = color || req.car.color;
    req.car.vin = vin || req.car.vin;
    req.car.licensePlate = licensePlate || req.car.licensePlate;
    req.car.mileage = mileage !== undefined ? mileage : req.car.mileage;
    req.car.fuelType = fuelType || req.car.fuelType;
    req.car.transmission = transmission || req.car.transmission;

    const updatedCar = await req.car.save();
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a car
router.delete('/:id', checkCarOwnership, async (req, res) => {
  try {
    await req.car.remove();
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;