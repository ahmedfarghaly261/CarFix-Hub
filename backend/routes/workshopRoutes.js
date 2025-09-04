const express = require('express');
const router = express.Router();
const Workshop = require('../models/workshop');

// Get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find({ isActive: true })
      .populate('mechanics', 'name email');
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific workshop
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id)
      .populate('mechanics', 'name email');
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new workshop (admin only)
router.post('/', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const workshop = new Workshop({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      specializations: req.body.specializations,
      operatingHours: req.body.operatingHours
    });

    const newWorkshop = await workshop.save();
    res.status(201).json(newWorkshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update workshop (admin only)
router.put('/:id', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'name', 'address', 'phone', 'email', 
      'specializations', 'operatingHours', 'isActive'
    ];

    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        workshop[update] = req.body[update];
      }
    });

    const updatedWorkshop = await workshop.save();
    res.json(updatedWorkshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add mechanic to workshop (admin only)
router.post('/:id/mechanics', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const mechanicId = req.body.mechanicId;
    if (!workshop.mechanics.includes(mechanicId)) {
      workshop.mechanics.push(mechanicId);
      await workshop.save();
    }

    res.json(workshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove mechanic from workshop (admin only)
router.delete('/:id/mechanics/:mechanicId', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    workshop.mechanics = workshop.mechanics.filter(
      mechanic => mechanic.toString() !== req.params.mechanicId
    );
    await workshop.save();

    res.json(workshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get workshop statistics (admin/owner only)
router.get('/:id/stats', async (req, res) => {
  if (req.user.role !== 'admin' && req.user.workshop?.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    // Add your statistics calculation logic here
    const stats = {
      totalRepairs: 0,
      completedRepairs: 0,
      averageRating: workshop.rating.average,
      totalRevenue: 0
      // Add more statistics as needed
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;