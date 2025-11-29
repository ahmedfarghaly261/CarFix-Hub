const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "mechanic", "admin"],
      default: "user",
    },
    phone: { type: String },
    
    // Mechanic-specific fields
    specializations: [String], // e.g., ["Engine Repair", "Brake Service", "Oil Changes"]
    workHours: {
      monday: { start: String, end: String },
      tuesday: { start: String, end: String },
      wednesday: { start: String, end: String },
      thursday: { start: String, end: String },
      friday: { start: String, end: String },
      saturday: { start: String, end: String },
      sunday: { start: String, end: String }
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop"
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalJobs: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    
    // Profile
    profileImage: String,
    bio: String,
    address: String,
    city: String,
  },
  { timestamps: true }
);

// hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// password compare function
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
