const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RepairRequest = require('../models/repairRequest');
const Notification = require('../models/notification');

// Mechanic middleware - check if user is mechanic
const mechanicOnly = async (req, res, next) => {
  try {
    if (req.user.role !== 'mechanic') {
      return res.status(403).json({ message: 'Mechanic access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============ DASHBOARD ============
router.get('/dashboard', mechanicOnly, async (req, res) => {
  try {
    const totalJobs = await RepairRequest.countDocuments({ workshopId: req.user.workshopId });
    const pendingJobs = await RepairRequest.countDocuments({ 
      workshopId: req.user.workshopId,
      status: 'pending' 
    });
    const inProgressJobs = await RepairRequest.countDocuments({ 
      workshopId: req.user.workshopId,
      status: 'in-progress' 
    });
    const completedJobs = await RepairRequest.countDocuments({ 
      workshopId: req.user.workshopId,
      status: 'completed' 
    });

    res.json({
      totalJobs,
      pendingJobs,
      inProgressJobs,
      completedJobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ JOBS MANAGEMENT ============
router.get('/jobs', mechanicOnly, async (req, res) => {
  try {
    const jobs = await RepairRequest.find({ workshopId: req.user.workshopId })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year plate')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/jobs/:id', mechanicOnly, async (req, res) => {
  try {
    const job = await RepairRequest.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year plate mileage');
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Verify mechanic has access to this job
    if (job.workshopId?.toString() !== req.user.workshopId?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ APPOINTMENTS ============
router.get('/appointments', mechanicOnly, async (req, res) => {
  try {
    const appointments = await RepairRequest.find({ 
      workshopId: req.user.workshopId,
      status: { $in: ['pending', 'assigned'] }
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year')
      .sort({ estimatedCompletionDate: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ IN-PROGRESS JOBS ============
router.get('/in-progress', mechanicOnly, async (req, res) => {
  try {
    const jobs = await RepairRequest.find({ 
      workshopId: req.user.workshopId,
      status: 'in-progress'
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year plate');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ COMPLETED JOBS ============
router.get('/completed', mechanicOnly, async (req, res) => {
  try {
    const jobs = await RepairRequest.find({ 
      workshopId: req.user.workshopId,
      status: 'completed'
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year')
      .sort({ actualCompletionDate: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ START WORK ============
router.put('/jobs/:id/start', mechanicOnly, async (req, res) => {
  try {
    const job = await RepairRequest.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Verify mechanic has access
    if (job.workshopId?.toString() !== req.user.workshopId?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job.status = 'in-progress';
    await job.save();

    // Create notification for user
    await Notification.create({
      userId: job.userId,
      type: 'job_started',
      title: 'Work Started',
      message: `Your repair request "${job.title}" has been started`,
      relatedId: job._id
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SEND UPDATE ============
router.post('/jobs/:id/update', mechanicOnly, async (req, res) => {
  try {
    const { message } = req.body;
    const job = await RepairRequest.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Verify mechanic has access
    if (job.workshopId?.toString() !== req.user.workshopId?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create notification for user
    await Notification.create({
      userId: job.userId,
      type: 'job_update',
      title: 'Work Update',
      message: message,
      relatedId: job._id
    });

    res.json({ message: 'Update sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ COMPLETE JOB ============
router.put('/jobs/:id/complete', mechanicOnly, async (req, res) => {
  try {
    const { notes, cost } = req.body;
    const job = await RepairRequest.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Verify mechanic has access
    if (job.workshopId?.toString() !== req.user.workshopId?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    job.status = 'completed';
    job.actualCompletionDate = new Date();
    if (cost) job.totalCost = cost;
    await job.save();

    // Update mechanic stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { completedJobs: 1 }
    });

    // Create notification for user
    await Notification.create({
      userId: job.userId,
      type: 'job_completed',
      title: 'Work Completed',
      message: `Your repair request "${job.title}" has been completed`,
      relatedId: job._id
    });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ REVIEWS ============
router.get('/reviews', mechanicOnly, async (req, res) => {
  try {
    const mechanic = await User.findById(req.user._id).select('rating completedJobs totalJobs');
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ PROFILE ============
router.get('/profile', mechanicOnly, async (req, res) => {
  try {
    const profile = await User.findById(req.user._id).select('-password');
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', mechanicOnly, async (req, res) => {
  try {
    const { name, phone, bio, specializations, workHours, address, city } = req.body;
    
    const profile = await User.findByIdAndUpdate(req.user._id, {
      name,
      phone,
      bio,
      specializations,
      workHours,
      address,
      city
    }, { new: true }).select('-password');
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SETTINGS ============
router.put('/settings', mechanicOnly, async (req, res) => {
  try {
    const { workHours, specializations } = req.body;
    
    const settings = await User.findByIdAndUpdate(req.user._id, {
      workHours,
      specializations
    }, { new: true }).select('-password');
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
