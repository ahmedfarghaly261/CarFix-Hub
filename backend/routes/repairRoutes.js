const express = require('express');
const router = express.Router();
const RepairRequest = require('../models/repairRequest');
const Notification = require('../models/notification');
const User = require('../models/user');

// Middleware to check repair request ownership or authorization
const checkRepairRequestAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ message: 'Not authorized - no user' });
    }

    const repairRequest = await RepairRequest.findById(req.params.id);
    if (!repairRequest) {
      return res.status(404).json({ message: 'Repair request not found' });
    }
    
    // Allow access if:
    // 1. User is the car owner (userId)
    // 2. User is admin
    // 3. User is the assigned mechanic (assignedTo)
    // 4. User is a mechanic in the same workshop
    const isOwner = repairRequest.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isAssignedMechanic = req.user.role === 'mechanic' && 
                               repairRequest.assignedTo && 
                               repairRequest.assignedTo.toString() === req.user._id.toString();
    const isWorkshopMechanic = req.user.role === 'mechanic' && 
                               req.user.workshopId && 
                               repairRequest.workshopId && 
                               repairRequest.workshopId.toString() === req.user.workshopId.toString();
    
    if (isOwner || isAdmin || isAssignedMechanic || isWorkshopMechanic) {
      req.repairRequest = repairRequest;
      next();
    } else {
      console.log('Authorization failed:', {
        userId: req.user._id.toString(),
        repairUserId: repairRequest.userId.toString(),
        repairAssignedTo: repairRequest.assignedTo?.toString(),
        userRole: req.user.role,
        userWorkshop: req.user.workshopId?.toString(),
        repairWorkshop: repairRequest.workshopId?.toString(),
        isOwner,
        isAdmin,
        isAssignedMechanic,
        isWorkshopMechanic
      });
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all repair requests (filtered by role)
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'user') {
      query.userId = req.user._id;
    } else if (req.user.role === 'mechanic') {
      // Show jobs assigned directly to them OR jobs from their workshop
      const orConditions = [];
      
      // Jobs directly assigned to this mechanic
      orConditions.push({ assignedTo: req.user._id });
      
      // Jobs from their workshop (if they belong to one)
      if (req.user.workshopId) {
        orConditions.push({ workshopId: req.user.workshopId });
      }
      
      if (orConditions.length > 0) {
        query.$or = orConditions;
      } else {
        // If mechanic has no workshop and no assignments, return empty
        query._id = { $in: [] };
      }
    }
    // Admin can see all requests

    const repairRequests = await RepairRequest.find(query)
      .populate('carId', 'make model year')
      .populate('userId', 'name email')
      .populate('workshopId', 'name');
      
    res.json(repairRequests);
  } catch (error) {
    console.error('GET /repairs error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get specific repair request
router.get('/:id', checkRepairRequestAuth, async (req, res) => {
  try {
    const repairRequest = await req.repairRequest
      .populate('carId', 'make model year')
      .populate('userId', 'name email')
      .populate('workshopId', 'name')
      .populate('iterations.mechanicId', 'name');
      
    res.json(repairRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new repair request (Book appointment)
router.post('/', async (req, res) => {
  try {
    if (!req.body.carId) {
      return res.status(400).json({ message: 'carId is required' });
    }
    if (!req.body.title) {
      return res.status(400).json({ message: 'title is required' });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: 'description is required' });
    }

    const repairRequest = new RepairRequest({
      carId: req.body.carId,
      userId: req.user._id,
      workshopId: req.body.workshopId,
      title: req.body.title,
      description: req.body.description,
      serviceType: req.body.serviceType,
      requestedDate: req.body.requestedDate,
      notes: req.body.notes,
      priority: req.body.priority || 'medium'
    });

    const newRepairRequest = await repairRequest.save();

    // Populate user data before sending response
    const populatedRequest = await RepairRequest.findById(newRepairRequest._id)
      .populate('carId', 'make model year licensePlate')
      .populate('userId', 'name email phone');

    // Create notification for admin (don't let this fail the main request)
    try {
      const admin = await User.findOne({ role: 'admin' });
      if (admin && admin._id) {
        await Notification.create({
          recipient: admin._id,
          title: 'New Appointment Request',
          message: `New appointment request for ${req.body.title}`,
          type: 'repair_update',
          relatedTo: {
            model: 'RepairRequest',
            id: newRepairRequest._id
          }
        });
        console.log('Notification created successfully for admin:', admin._id);
      } else {
        console.log('No admin user found - skipping notification');
      }
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError.message);
      // Don't throw - notification creation should not fail the booking
    }

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Repair POST error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Add repair iteration
router.post('/:id/iterations', checkRepairRequestAuth, async (req, res) => {
  try {
    if (req.user.role !== 'mechanic') {
      return res.status(403).json({ message: 'Only mechanics can add repair iterations' });
    }

    const iteration = {
      description: req.body.description,
      mechanicNotes: req.body.mechanicNotes,
      status: req.body.status,
      cost: req.body.cost,
      mechanicId: req.user._id,
      images: req.body.images
    };

    req.repairRequest.iterations.push(iteration);
    req.repairRequest.status = req.body.status;
    if (req.body.status === 'completed') {
      req.repairRequest.actualCompletionDate = new Date();
    }

    const updatedRequest = await req.repairRequest.save();

    // Create notification for car owner
    await Notification.create({
      recipient: req.repairRequest.userId,
      title: 'Repair Update',
      message: `Your repair request "${req.repairRequest.title}" has been updated`,
      type: 'repair_update',
      relatedTo: {
        model: 'RepairRequest',
        id: req.repairRequest._id
      }
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update repair request
router.put('/:id', checkRepairRequestAuth, async (req, res) => {
  try {
    const allowedUpdates = ['title', 'description', 'priority', 'status', 'estimatedCompletionDate'];
    allowedUpdates.forEach(update => {
      if (req.body[update] !== undefined) {
        req.repairRequest[update] = req.body[update];
      }
    });

    const updatedRequest = await req.repairRequest.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('PUT /repairs/:id error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete repair request
router.delete('/:id', checkRepairRequestAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.repairRequest.status !== 'pending') {
      return res.status(403).json({ message: 'Can only delete pending repair requests' });
    }

    await req.repairRequest.remove();
    res.json({ message: 'Repair request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;