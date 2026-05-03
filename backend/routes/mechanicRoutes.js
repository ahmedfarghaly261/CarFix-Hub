const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RepairRequest = require('../models/repairRequest');const Review = require("../models/review");const Notification = require('../models/notification');

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
    console.log('Mechanic jobs request:', {
      mechanicId: req.user._id,
      mechanicName: req.user.name,
      workshopId: req.user.workshopId
    });

    const jobs = await RepairRequest.find({
      $or: [
        { assignedTo: req.user._id },
        { workshopId: req.user.workshopId }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
      .populate('workshopId', 'name address phone')
      .sort({ createdAt: -1 });

    console.log('Jobs found:', jobs.length);
    if (jobs.length > 0) {
      console.log('Job details:', jobs.map(j => ({
        id: j._id,
        title: j.title,
        assignedTo: j.assignedTo,
        workshopId: j.workshopId,
        status: j.status
      })));
    }

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching mechanic jobs:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/jobs/:id', mechanicOnly, async (req, res) => {
  try {
    const job = await RepairRequest.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate mileage')
      .populate('workshopId', 'name address phone');
    
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
      $or: [
        { assignedTo: req.user._id, status: { $in: ['pending', 'assigned'] } },
        { workshopId: req.user.workshopId, status: { $in: ['pending', 'assigned'] } }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
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
      $or: [
        { assignedTo: req.user._id, status: 'in-progress' },
        { workshopId: req.user.workshopId, status: 'in-progress' }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ COMPLETED JOBS ============
router.get('/completed', mechanicOnly, async (req, res) => {
  try {
    const jobs = await RepairRequest.find({ 
      $or: [
        { assignedTo: req.user._id, status: 'completed' },
        { workshopId: req.user.workshopId, status: 'completed' }
      ]
    })
      .populate('userId', 'name email phone')
      .populate('carId', 'make model year licensePlate')
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
    
    if (!job) {
      console.log('Job not found:', req.params.id);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    console.log('Start job attempt:', {
      jobId: req.params.id,
      jobWorkshopId: job.workshopId?.toString(),
      jobAssignedTo: job.assignedTo?.toString(),
      userId: req.user._id.toString(),
      userWorkshopId: req.user.workshopId?.toString(),
      userRole: req.user.role
    });
    
    // REQUIREMENT: Mechanic must be assigned to a workshop
    if (!req.user.workshopId) {
      console.log('Mechanic not assigned to any workshop');
      return res.status(403).json({ 
        message: 'You must be assigned to a workshop to work on jobs' 
      });
    }
    
    // Check if mechanic is assigned directly to this job
    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === req.user._id.toString();
    
    // Check if mechanic's workshop matches job's workshop
    const isInSameWorkshop = job.workshopId && 
                             job.workshopId.toString() === req.user.workshopId.toString();
    
    // Check if job is unassigned (no workshop yet) - mechanic can claim it
    const isUnassignedJob = !job.workshopId && !job.assignedTo;
    
    // Verify authorization: must be directly assigned OR in same workshop OR job is unassigned
    if (!isAssignedToMechanic && !isInSameWorkshop && !isUnassignedJob) {
      console.log('Mechanic not authorized for this specific job', {
        isAssignedToMechanic,
        isInSameWorkshop,
        isUnassignedJob
      });
      return res.status(403).json({ message: 'Not authorized for this job' });
    }
    
    // Auto-assign: if job has no workshop, assign it to the mechanic's workshop
    if (!job.workshopId) {
      job.workshopId = req.user.workshopId;
      console.log('Assigned job to workshop:', req.user.workshopId);
    }

    job.status = 'in-progress';
    await job.save();

    // Create notification for user (don't let this fail the main request)
    try {
      await Notification.create({
        recipient: job.userId,
        type: 'status_change',
        title: 'Work Started',
        message: `Your repair request "${job.title}" has been started`,
        relatedTo: {
          model: 'RepairRequest',
          id: job._id
        }
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError.message);
      // Don't throw - notification failure shouldn't fail the main request
    }

    res.json(job);
  } catch (error) {
    console.error('Start job error:', error);
    res.status(500).json({ message: error.message });
  }
});

// ============ SEND UPDATE ============
router.post('/jobs/:id/update', mechanicOnly, async (req, res) => {
  try {
    const { message } = req.body;
    
    // REQUIREMENT: Mechanic must be assigned to a workshop
    if (!req.user.workshopId) {
      return res.status(403).json({ 
        message: 'You must be assigned to a workshop to work on jobs' 
      });
    }
    
    const job = await RepairRequest.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Verify mechanic has access: either directly assigned, in same workshop, or job is unassigned
    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === req.user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === req.user.workshopId.toString();
    
    if (!isAssignedToMechanic && !isInSameWorkshop) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Auto-assign job to mechanic's workshop if unassigned
    if (!job.workshopId) {
      job.workshopId = req.user.workshopId;
      await job.save();
    }

    // Create notification for user
    try {
      await Notification.create({
        recipient: job.userId,
        type: 'repair_update',
        title: 'Work Update',
        message: message,
        relatedTo: {
          model: 'RepairRequest',
          id: job._id
        }
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError.message);
      // Don't throw - notification failure shouldn't fail the main request
    }

    res.json({ message: 'Update sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ ADD WORK REPORT ============
router.put('/jobs/:id/update', mechanicOnly, async (req, res) => {
  try {
    const { reportDetails, repairItem, repairAmount } = req.body;
    
    // REQUIREMENT: Mechanic must be assigned to a workshop
    if (!req.user.workshopId) {
      return res.status(403).json({ 
        message: 'You must be assigned to a workshop to work on jobs' 
      });
    }
    
    const job = await RepairRequest.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Verify mechanic has access: either directly assigned, in same workshop, or job is unassigned
    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === req.user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === req.user.workshopId.toString();
    
    if (!isAssignedToMechanic && !isInSameWorkshop) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Auto-assign job to mechanic's workshop if unassigned
    if (!job.workshopId) {
      job.workshopId = req.user.workshopId;
    }

    // Add or update report details
    if (reportDetails) {
      job.reportDetails = reportDetails;
    }

    const hasRepairItem = typeof repairItem === 'string' && repairItem.trim() !== '';
    const hasRepairAmount = repairAmount != null && repairAmount !== '';

    if (hasRepairItem || hasRepairAmount) {
      const parsedAmount = Number(repairAmount);
      if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({ message: 'Valid repair amount is required' });
      }

      job.iterations.push({
        description: hasRepairItem ? repairItem.trim() : 'Repair work',
        mechanicNotes: reportDetails || '',
        status: 'completed',
        cost: {
          total: parsedAmount
        },
        mechanicId: req.user._id,
        completedAt: new Date()
      });
    }
    
    await job.save();

    res.json({ message: 'Report added successfully', job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ COMPLETE JOB ============
router.put('/jobs/:id/complete', mechanicOnly, async (req, res) => {
  try {
    const { notes, cost } = req.body;
    
    console.log(`[PUT /jobs/:id/complete] Mechanic ${req.user._id} marking job ${req.params.id} as complete`);
    
    // REQUIREMENT: Mechanic must be assigned to a workshop
    if (!req.user.workshopId) {
      return res.status(403).json({ 
        message: 'You must be assigned to a workshop to work on jobs' 
      });
    }
    
    const job = await RepairRequest.findById(req.params.id);
    
    if (!job) {
      console.log(`[PUT /jobs/:id/complete] Job not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Verify mechanic has access: either directly assigned, in same workshop, or job is unassigned
    const isAssignedToMechanic = job.assignedTo && job.assignedTo.toString() === req.user._id.toString();
    const isInSameWorkshop = job.workshopId && job.workshopId.toString() === req.user.workshopId.toString();
    
    if (!isAssignedToMechanic && !isInSameWorkshop) {
      console.log(`[PUT /jobs/:id/complete] Not authorized - mechanic not assigned and not in same workshop`);
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Auto-assign job to mechanic's workshop if unassigned
    if (!job.workshopId) {
      job.workshopId = req.user.workshopId;
    }

    job.status = 'completed';
    job.actualCompletionDate = new Date();
    if (cost) job.totalCost = cost;
    await job.save();

    console.log(`[PUT /jobs/:id/complete] Job marked as completed. Status: ${job.status}, Date: ${job.actualCompletionDate}`);

    // Update mechanic stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { completedJobs: 1 }
    });

    // Create notification for user
    try {
      await Notification.create({
        recipient: job.userId,
        type: 'status_change',
        title: 'Work Completed',
        message: `Your repair request "${job.title}" has been completed`,
        relatedTo: {
          model: 'RepairRequest',
          id: job._id
        }
      });
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError.message);
    }

    // Create notification for admin(s)
    try {
      const admins = await User.find({ role: 'admin' }).select('_id');
      for (const admin of admins) {
        await Notification.create({
          recipient: admin._id,
          type: 'job_completed',
          title: 'Job Completed',
          message: `Mechanic "${req.user.name}" has completed the job "${job.title}"`,
          relatedTo: {
            model: 'RepairRequest',
            id: job._id
          }
        });
      }
    } catch (notificationError) {
      console.error('Failed to create admin notification:', notificationError.message);
    }

    res.json(job);
  } catch (error) {
    console.error(`[PUT /jobs/:id/complete] Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// ============ REVIEWS ============
router.get('/reviews', mechanicOnly, async (req, res) => {
  try {
    const mechanic = await User.findById(req.user._id).select('name rating completedJobs totalJobs');
    
    // Get all reviews for this mechanic
    const reviews = await Review.find({ mechanicId: req.user._id })
      .populate('userId', 'name')
      .populate('repairRequestId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      mechanic,
      reviews,
      totalReviews: reviews.length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0
    });
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

// ============ DIAGNOSTIC ENDPOINT ============
router.get('/debug/status', mechanicOnly, async (req, res) => {
  try {
    const mechanic = await User.findById(req.user._id).select('-password');
    const allRequests = await RepairRequest.find().select('_id title status assignedTo workshopId userId');
    const myJobs = await RepairRequest.find({
      $or: [
        { assignedTo: req.user._id },
        { workshopId: req.user.workshopId }
      ]
    }).select('_id title status assignedTo workshopId userId');

    res.json({
      mechanic: {
        _id: mechanic._id,
        name: mechanic.name,
        workshopId: mechanic.workshopId,
        role: mechanic.role
      },
      totalRequestsInDB: allRequests.length,
      allRequests: allRequests.map(r => ({
        _id: r._id,
        title: r.title,
        status: r.status,
        assignedTo: r.assignedTo?.toString(),
        workshopId: r.workshopId?.toString()
      })),
      myJobsCount: myJobs.length,
      myJobs: myJobs.map(j => ({
        _id: j._id,
        title: j.title,
        status: j.status,
        assignedTo: j.assignedTo?.toString(),
        workshopId: j.workshopId?.toString()
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ DIAGNOSTIC ENDPOINT ============
router.get('/debug/all-requests', mechanicOnly, async (req, res) => {
  try {
    const allRequests = await RepairRequest.find();
    const myJobs = await RepairRequest.find({
      $or: [
        { assignedTo: req.user._id },
        { workshopId: req.user.workshopId }
      ]
    });

    res.json({
      mechanic: {
        _id: req.user._id,
        name: req.user.name,
        workshopId: req.user.workshopId
      },
      allRequestsCount: allRequests.length,
      allRequests: allRequests.map(r => ({
        _id: r._id,
        title: r.title,
        status: r.status,
        assignedTo: r.assignedTo?.toString() || 'null',
        workshopId: r.workshopId?.toString() || 'null',
        userId: r.userId?.toString()
      })),
      myJobsCount: myJobs.length,
      myJobs: myJobs.map(j => ({
        _id: j._id,
        title: j.title,
        status: j.status,
        assignedTo: j.assignedTo?.toString() || 'null',
        workshopId: j.workshopId?.toString() || 'null'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/debug/simple', mechanicOnly, async (req, res) => {
  try {
    // Check what's actually in database
    const allJobs = await RepairRequest.find({}).select('_id title status assignedTo workshopId').limit(5);
    
    console.log('Raw DB data:', allJobs.map(j => ({
      _id: j._id,
      title: j.title,
      status: j.status,
      assignedTo: j.assignedTo,
      assignedToType: typeof j.assignedTo,
      workshopId: j.workshopId,
      workshopIdType: typeof j.workshopId
    })));

    const myJobs = await RepairRequest.find({
      $or: [
        { assignedTo: req.user._id },
        { workshopId: req.user.workshopId }
      ]
    }).select('_id title status assignedTo workshopId');

    res.json({
      userId: req.user._id,
      userWorkshopId: req.user.workshopId,
      jobsFound: myJobs.length,
      jobs: myJobs,
      allJobsSample: allJobs.map(j => ({
        _id: j._id,
        title: j.title,
        status: j.status,
        assignedTo: j.assignedTo?.toString() || 'null',
        workshopId: j.workshopId?.toString() || 'null'
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
