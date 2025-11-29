const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    make: { type: String, required: true }, // e.g. Toyota
    model: { type: String, required: true },
    year: { type: Number },
    color: { type: String },
    vin: { type: String, unique: true }, // Vehicle Identification Number
    licensePlate: { type: String, unique: true },
    mileage: { type: Number, default: 0 },
    fuelType: { type: String }, // e.g., Gasoline, Diesel, Electric, Hybrid
    transmission: { type: String }, // e.g., Automatic, Manual
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
module.exports = Car;