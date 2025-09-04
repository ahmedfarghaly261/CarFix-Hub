const express = require('express');
const router = express.Router();
const RepairRequest = require('../models/repairRequest');
const Notification = require('../models/notification');

// Middleware to check repair request ownership or authorization
const checkRepairRequestAuth = async (req, res, next) => {
  try {
    const repairRequest = await RepairRequest.findById(req.params.id);
    if (!repairRequest) {
      return res.status(404).json({ message: 'Repair request not found' });
    }
    
    // Allow access if user is owner, assigned mechanic, or admin
    if (
      repairRequest.userId.toString() === req.user._id.toString() ||
      req.user.role === 'admin' ||
      (req.user.role === 'mechanic' && repairRequest.workshopId.toString() === req.user.workshop.toString())
    ) {
      req.repairRequest = repairRequest;
      next();
    } else {
      res.status(403).json({ message: 'Not authorized' });
    }
  } catch (error) {
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
      query.workshopId = req.user.workshop;
    }
    // Admin can see all requests

    const repairRequests = await RepairRequest.find(query)
      .populate('carId', 'make model year')
      .populate('userId', 'name email')
      .populate('workshopId', 'name');
      
    res.json(repairRequests);
  } catch (error) {
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

// Create new repair request
router.post('/', async (req, res) => {
  try {
    const repairRequest = new RepairRequest({
      carId: req.body.carId,
      userId: req.user._id,
      workshopId: req.body.workshopId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority
    });

    const newRepairRequest = await repairRequest.save();

    // Create notification for workshop
    await Notification.create({
      recipient: req.body.workshopId,
      title: 'New Repair Request',
      message: `New repair request for ${req.body.title}`,
      type: 'repair_update',
      relatedTo: {
        model: 'RepairRequest',
        id: newRepairRequest._id
      }
    });

    res.status(201).json(newRepairRequest);
  } catch (error) {
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
      if (req.body[update]) {
        req.repairRequest[update] = req.body[update];
      }
    });

    const updatedRequest = await req.repairRequest.save();
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
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