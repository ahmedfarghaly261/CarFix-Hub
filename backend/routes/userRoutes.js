const express = require('express');
const router = express.Router();
const User = require('../models/user');
const RepairRequest = require('../models/repairRequest');
const Review = require('../models/review');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      workshopId: user.workshopId,
      phone: user.phone,
      profileImage: user.profileImage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      workshopId: user.workshopId,
      phone: user.phone,
      profileImage: user.profileImage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
});

// Get user profile
router.get('/profile', protect, async (req, res) => {
  res.json(req.user);
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.bio = req.body.bio || user.bio;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      city: updatedUser.city,
      bio: updatedUser.bio,
      role: updatedUser.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin Routes
router.get('/users', protect, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
  const users = await User.find({}).select('-password');
  res.json(users);
});

// ============ COMPLETED REPAIRS FOR USER ============
router.get('/completed-repairs', protect, async (req, res) => {
  try {
    // console.log(`[GET /completed-repairs] Fetching for user: ${req.user._id}`);
    const completedRepairs = await RepairRequest.find({
      userId: req.user._id,
      status: 'completed'
    })
      .populate('carId', 'make model year plate')
      .populate('assignedTo', 'name rating')
      .populate('workshopId', 'name address phone')
      .sort({ actualCompletionDate: -1 });

    console.log(`[GET /completed-repairs] Found ${completedRepairs.length} completed repairs`);
    res.json(completedRepairs);
  } catch (error) {
    console.error(`[GET /completed-repairs] Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// ============ REPAIR HISTORY BY CAR ============
router.get('/repairs-history/:carId', protect, async (req, res) => {
  try {
    const repairs = await RepairRequest.find({
      userId: req.user._id,
      carId: req.params.carId
    })
      .populate('assignedTo', 'name rating')
      .populate('workshopId', 'name address phone')
      .populate('carId', 'make model year plate')
      .sort({ createdAt: -1 });

    res.json(repairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ============ SUBMIT REVIEW/RATING ============
router.post('/reviews', protect, async (req, res) => {
  try {
    const { repairRequestId, rating, comment, workQuality, timeliness, communication } = req.body;

    console.log(`[POST /reviews] User ${req.user._id} submitting review for repair ${repairRequestId}`);

    // Get repair request to verify it's completed
    const repair = await RepairRequest.findById(repairRequestId);
    if (!repair) {
      console.log(`[POST /reviews] Repair not found: ${repairRequestId}`);
      return res.status(404).json({ message: 'Repair request not found' });
    }

    if (repair.status !== 'completed') {
      console.log(`[POST /reviews] Repair not completed, status: ${repair.status}`);
      return res.status(400).json({ message: 'Can only review completed repairs' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ repairRequestId });
    if (existingReview) {
      console.log(`[POST /reviews] Review already exists for repair ${repairRequestId}`);
      return res.status(400).json({ message: 'Review already exists for this repair' });
    }

    // Create review
    const review = await Review.create({
      repairRequestId,
      mechanicId: repair.assignedTo,
      userId: req.user._id,
      rating,
      comment,
      workQuality: workQuality || rating,
      timeliness: timeliness || rating,
      communication: communication || rating
    });

    console.log(`[POST /reviews] Review created successfully with rating ${rating}`);

    // Update mechanic's rating in User model
    const mechanic = await User.findById(repair.assignedTo);
    if (mechanic) {
      const allReviews = await Review.find({ mechanicId: repair.assignedTo });
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      mechanic.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      await mechanic.save();
      console.log(`[POST /reviews] Updated mechanic ${repair.assignedTo} rating to ${mechanic.rating}`);
    }

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error(`[POST /reviews] Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

// ============ GET REPAIR DETAILS WITH REVIEW ============
router.get('/repair/:id', protect, async (req, res) => {
  try {
    const repair = await RepairRequest.findById(req.params.id)
      .populate('carId')
      .populate('assignedTo', 'name rating profileImage')
      .populate('userId');

    if (!repair) {
      console.log(`[GET /repair/:id] Repair not found: ${req.params.id}`);
      return res.status(404).json({ message: 'Repair not found' });
    }

    // Check authorization
    if (repair.userId._id.toString() !== req.user._id.toString()) {
      console.log(`[GET /repair/:id] Not authorized - repair belongs to ${repair.userId._id}, user is ${req.user._id}`);
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get review if exists
    const review = await Review.findOne({ repairRequestId: req.params.id });

    console.log(`[GET /repair/:id] Repair found with review status: ${!!review}`);
    res.json({
      repair,
      review,
      hasReview: !!review
    });
  } catch (error) {
    console.error(`[GET /repair/:id] Error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;