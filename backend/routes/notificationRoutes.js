const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const User = require('../models/user');

// Get user's notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      recipient: req.user._id 
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread notifications count
router.get('/unread', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipient: req.user._id,
      read: false 
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.put('/:id', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = req.body.read !== undefined ? req.body.read : true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a notification
router.delete('/:id', async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notification for admin when new repair request comes (internal use)
router.post('/create', async (req, res) => {
  try {
    const { title, message, type, relatedId } = req.body;
    
    // Get admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const notification = new Notification({
      recipient: admin._id,
      title: title || 'New Repair Request',
      message: message || 'A new repair request has been submitted',
      type: type || 'repair_update',
      relatedTo: {
        model: 'RepairRequest',
        id: relatedId
      },
      read: false
    });

    const newNotification = await notification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;