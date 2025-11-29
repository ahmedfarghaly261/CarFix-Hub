const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RepairRequest = require('../models/repairRequest');
const Car = require('../models/car');
const Workshop = require('../models/workshop');
const Service = require('../models/service');
const Notification = require('../models/notification');

// Admin middleware - check if user is admin
const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ DASHBOARD ============
router.get('/dashboard', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMechanics = await User.countDocuments({ role: 'mechanic' });
    const totalRequests = await RepairRequest.countDocuments();
    const pendingRequests = await RepairRequest.countDocuments({ status: 'pending' });
    const inProgressRequests = await RepairRequest.countDocuments({ status: 'in-progress' });
    const completedRequests = await RepairRequest.countDocuments({ status: 'completed' });

    res.json({
      totalUsers,
      totalMechanics,
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ USERS MANAGEMENT ============
router.get('/users', adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users/:id', adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id', adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ MECHANICS MANAGEMENT ============
router.get('/mechanics', adminOnly, async (req, res) => {
  try {
    const mechanics = await User.find({ role: 'mechanic' }).select('-password');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/mechanics/:id', adminOnly, async (req, res) => {
  try {
    const mechanic = await User.findById(req.params.id).select('-password');
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/mechanics', adminOnly, async (req, res) => {
  try {
    const mechanic = new User({
      ...req.body,
      role: 'mechanic'
    });
    const newMechanic = await mechanic.save();
    res.status(201).json(newMechanic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/mechanics/:id', adminOnly, async (req, res) => {
  try {
    const mechanic = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/mechanics/:id', adminOnly, async (req, res) => {
  try {
    const mechanic = await User.findByIdAndDelete(req.params.id);
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    res.json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ BOOKINGS/REPAIR REQUESTS ============
router.get('/bookings', adminOnly, async (req, res) => {
  try {
    const bookings = await RepairRequest.find()
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year')
      .populate('workshopId', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/bookings/:id', adminOnly, async (req, res) => {
  try {
    const booking = await RepairRequest.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year')
      .populate('workshopId', 'name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/bookings/:id', adminOnly, async (req, res) => {
  try {
    const booking = await RepairRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SERVICES MANAGEMENT ============
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/services', adminOnly, async (req, res) => {
  try {
    const service = new Service(req.body);
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/services/:id', adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/services/:id', adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ REVIEWS/RATINGS ============
router.get('/reviews', adminOnly, async (req, res) => {
  try {
    // Get mechanics with their ratings
    const mechanics = await User.find({ role: 'mechanic' })
      .select('name rating completedJobs');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ REPORTS ============
router.get('/reports', adminOnly, async (req, res) => {
  try {
    const totalRevenue = await RepairRequest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } }
    ]);

    const requestsByStatus = await RepairRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const requestsByPriority = await RepairRequest.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      requestsByStatus,
      requestsByPriority
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
