require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Create Express app
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const repairRoutes = require('./routes/repairRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const notificationRoutes = require('./routes/notificationRoutes');



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cars', protect, carRoutes);
app.use('/api/repairs', protect, repairRoutes);
app.use('/api/workshops', protect, workshopRoutes);
app.use('/api/notifications', protect, notificationRoutes);


// Auth middleware
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

