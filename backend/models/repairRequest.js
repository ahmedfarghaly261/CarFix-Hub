const mongoose = require('mongoose');

const repairIterationSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  mechanicNotes: String,
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  cost: {
    parts: [{ 
      name: String,
      price: Number,
      quantity: Number
    }],
    labor: Number,
    total: Number
  },
  completedAt: Date,
  mechanicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [String]
}, {
  timestamps: true
});

const repairRequestSchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  iterations: [repairIterationSchema],
  totalCost: {
    type: Number,
    default: 0
  },
  estimatedCompletionDate: Date,
  actualCompletionDate: Date
}, {
  timestamps: true
});

// Calculate total cost when iterations are updated
repairRequestSchema.pre('save', function(next) {
  if (this.iterations && this.iterations.length > 0) {
    this.totalCost = this.iterations.reduce((total, iteration) => {
      const partsCost = iteration.cost?.parts?.reduce((sum, part) => 
        sum + (part.price * part.quantity), 0) || 0;
      const laborCost = iteration.cost?.labor || 0;
      return total + partsCost + laborCost;
    }, 0);
  }
  next();
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);