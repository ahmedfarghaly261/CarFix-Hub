const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RepairRequest = require('../models/repairRequest');
const Car = require('../models/car');
const Workshop = require('../models/workshop');
const Service = require('../models/service');
const Notification = require('../models/notification');
const Review = require('../models/review');

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
    
    // If workshopId is provided, add mechanic to workshop's mechanics array
    if (req.body.workshopId) {
      await Workshop.findByIdAndUpdate(
        req.body.workshopId,
        { $addToSet: { mechanics: newMechanic._id } },
        { new: true }
      );
    }
    
    res.status(201).json(newMechanic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/mechanics/:id', adminOnly, async (req, res) => {
  try {
    const mechanic = await User.findById(req.params.id);
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    
    const oldWorkshopId = mechanic.workshopId;
    const newWorkshopId = req.body.workshopId;
    
    // If workshop is being changed, update both workshops' mechanics arrays
    if (oldWorkshopId && newWorkshopId && oldWorkshopId.toString() !== newWorkshopId.toString()) {
      // Remove from old workshop
      await Workshop.findByIdAndUpdate(
        oldWorkshopId,
        { $pull: { mechanics: mechanic._id } }
      );
      // Add to new workshop
      await Workshop.findByIdAndUpdate(
        newWorkshopId,
        { $addToSet: { mechanics: mechanic._id } }
      );
    } else if (!oldWorkshopId && newWorkshopId) {
      // Mechanic didn't have a workshop, add to new one
      await Workshop.findByIdAndUpdate(
        newWorkshopId,
        { $addToSet: { mechanics: mechanic._id } }
      );
    } else if (oldWorkshopId && !newWorkshopId) {
      // Removing workshop from mechanic
      await Workshop.findByIdAndUpdate(
        oldWorkshopId,
        { $pull: { mechanics: mechanic._id } }
      );
    }
    
    // Update mechanic record
    const updatedMechanic = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updatedMechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/mechanics/:id', adminOnly, async (req, res) => {
  try {
    const mechanic = await User.findByIdAndDelete(req.params.id);
    if (!mechanic) return res.status(404).json({ message: 'Mechanic not found' });
    
    // Remove mechanic from workshop if assigned
    if (mechanic.workshopId) {
      await Workshop.findByIdAndUpdate(
        mechanic.workshopId,
        { $pull: { mechanics: mechanic._id } }
      );
    }
    
    res.json({ message: 'Mechanic deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    // Validate required fields
    if (!req.body.name || !req.body.price || !req.body.duration) {
      return res.status(400).json({ message: 'Name, price, and duration are required' });
    }

    // Check if service with same name already exists
    const existingService = await Service.findOne({ name: req.body.name });
    if (existingService) {
      return res.status(400).json({ message: `Service with name "${req.body.name}" already exists` });
    }

    const service = new Service(req.body);
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(400).json({ message: error.message || 'Failed to save service' });
  }
});

router.put('/services/:id', adminOnly, async (req, res) => {
  try {
    // Check if service exists
    const existingService = await Service.findById(req.params.id);
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // If name is being updated, check for duplicates
    if (req.body.name && req.body.name !== existingService.name) {
      const duplicateService = await Service.findOne({ name: req.body.name });
      if (duplicateService) {
        return res.status(400).json({ message: `Service with name "${req.body.name}" already exists` });
      }
    }

    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(service);
  } catch (error) {
    console.error('Service update error:', error);
    res.status(400).json({ message: error.message || 'Failed to update service' });
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
    console.log('[GET /admin/reviews] Fetching reviews...');
    
    // First get all reviews with their raw data
    const reviews = await Review.find().sort({ createdAt: -1 });
    console.log(`[GET /admin/reviews] Found ${reviews.length} raw reviews`);
    
    // Log sample review to debug
    if (reviews.length > 0) {
      console.log('[GET /admin/reviews] Sample review:', {
        _id: reviews[0]._id,
        userId: reviews[0].userId,
        mechanicId: reviews[0].mechanicId,
        repairRequestId: reviews[0].repairRequestId,
        rating: reviews[0].rating,
        comment: reviews[0].comment
      });
    }
    
    // Now populate with user and mechanic details
    const populatedReviews = await Review.find()
      .populate({
        path: 'userId',
        select: 'name email phone',
        model: 'User'
      })
      .populate({
        path: 'mechanicId',
        select: 'name email rating',
        model: 'User'
      })
      .populate({
        path: 'repairRequestId',
        select: 'title description status completedAt',
        model: 'RepairRequest'
      })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`[GET /admin/reviews] Populated ${populatedReviews.length} reviews`);
    
    if (populatedReviews.length > 0) {
      console.log('[GET /admin/reviews] Sample populated review:', {
        _id: populatedReviews[0]._id,
        userId: populatedReviews[0].userId,
        mechanicId: populatedReviews[0].mechanicId,
        rating: populatedReviews[0].rating,
        comment: populatedReviews[0].comment
      });
    }
    
    res.json(populatedReviews);
  } catch (error) {
    console.error('[GET /admin/reviews] Error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/reviews/:id', adminOnly, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper endpoint to fix missing user/mechanic data in reviews
router.post('/reviews/fix-missing-data', adminOnly, async (req, res) => {
  try {
    console.log('[POST /reviews/fix-missing-data] Starting...');
    
    // Get all reviews
    const allReviews = await Review.find();
    console.log(`[POST /reviews/fix-missing-data] Found ${allReviews.length} total reviews`);
    
    let fixed = 0;
    let errors = [];
    
    for (const review of allReviews) {
      try {
        let needsUpdate = false;
        
        // If userId is missing or null, get from repair
        if (!review.userId) {
          const repair = await RepairRequest.findById(review.repairRequestId);
          if (repair && repair.userId) {
            review.userId = repair.userId;
            needsUpdate = true;
            console.log(`[POST /reviews/fix-missing-data] Fixed userId for review ${review._id}`);
          }
        }
        
        // If mechanicId is missing or null, get from repair
        if (!review.mechanicId) {
          const repair = await RepairRequest.findById(review.repairRequestId);
          if (repair && repair.assignedTo) {
            review.mechanicId = repair.assignedTo;
            needsUpdate = true;
            console.log(`[POST /reviews/fix-missing-data] Fixed mechanicId for review ${review._id}`);
          }
        }
        
        // If rating is missing, default to 0
        if (!review.rating) {
          review.rating = 0;
          needsUpdate = true;
        }
        
        // If comment is missing, set to empty string
        if (!review.comment) {
          review.comment = '';
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await review.save();
          fixed++;
        }
      } catch (error) {
        errors.push({
          reviewId: review._id,
          error: error.message
        });
        console.error(`[POST /reviews/fix-missing-data] Error processing review ${review._id}:`, error);
      }
    }
    
    console.log(`[POST /reviews/fix-missing-data] Completed - Fixed ${fixed} reviews`);
    
    res.json({ 
      message: `Fixed ${fixed} reviews with missing data`,
      fixedCount: fixed,
      errors: errors
    });
  } catch (error) {
    console.error('[POST /reviews/fix-missing-data] Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ JOBS MANAGEMENT (All Jobs with details) ============
router.get('/jobs', adminOnly, async (req, res) => {
  try {
    const jobs = await RepairRequest.find()
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
      .populate('workshopId', 'name address')
      .populate('assignedTo', 'name email phone specializations')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/jobs/:id', adminOnly, async (req, res) => {
  try {
    const job = await RepairRequest.findById(req.params.id)
      .populate('userId', 'name email phone address city')
      .populate('carId', 'make model year licensePlate mileage')
      .populate('workshopId', 'name address phone')
      .populate('assignedTo', 'name email phone specializations rating');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send invoice to user
router.post('/jobs/:id/send-invoice', adminOnly, async (req, res) => {
  try {
    const { amount } = req.body;
    const job = await RepairRequest.findById(req.params.id)
      .populate('userId', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (amount != null) {
      const parsedAmount = Number(amount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({ message: 'Valid invoice amount is required' });
      }
      job.billingAmount = parsedAmount;
    }

    job.invoiceSent = true;
    job.invoiceSentAt = new Date();
    await job.save();

    const invoiceAmount = job.billingAmount ?? job.totalCost;

    // Notify the user about the invoice
    await Notification.create({
      recipient: job.userId._id,
      type: 'invoice',
      title: 'Invoice Received',
      message: `An invoice of $${invoiceAmount} has been sent for your repair "${job.title}"`,
      relatedTo: {
        model: 'RepairRequest',
        id: job._id
      }
    });

    res.json({ message: 'Invoice sent successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set mechanic salary for a job
router.put('/jobs/:id/salary', adminOnly, async (req, res) => {
  try {
    const { mechanicSalary } = req.body;
    if (mechanicSalary == null || mechanicSalary < 0) {
      return res.status(400).json({ message: 'Valid salary amount is required' });
    }

    const job = await RepairRequest.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    job.mechanicSalary = mechanicSalary;
    await job.save();

    res.json({ message: 'Salary updated successfully', job });
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

// ============ DATA MIGRATION ============
router.post('/migrate/fix-assignments', adminOnly, async (req, res) => {
  try {
    // Find the first workshop (default workshop)
    const defaultWorkshop = await Workshop.findOne().select('_id');
    if (!defaultWorkshop) {
      return res.status(400).json({ message: 'No workshop found in system' });
    }

    // Update all repair requests with null assignedTo and workshopId
    const result = await RepairRequest.updateMany(
      { 
        $or: [
          { assignedTo: null },
          { workshopId: null }
        ]
      },
      {
        $set: {
          workshopId: defaultWorkshop._id
        }
      }
    );

    res.json({
      message: 'Data migration completed',
      modifiedCount: result.modifiedCount,
      defaultWorkshop: defaultWorkshop._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
