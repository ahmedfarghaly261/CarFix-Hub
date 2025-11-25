
const mongoose = require("mongoose");

const repairOrderSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Must be a mechanic
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    issuesReported: { type: String, required: true },
    workDone: { type: String },
    cost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RepairOrder = mongoose.model("RepairOrder", repairOrderSchema);
module.exports = RepairOrder;