const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    duration: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['maintenance', 'repair', 'diagnostics', 'customization'],
      default: 'maintenance'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
