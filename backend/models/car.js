import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    make: { type: String, required: true }, // e.g. Toyota
    model: { type: String, required: true },
    year: { type: Number },
    vin: { type: String, unique: true }, // Vehicle Identification Number
    licensePlate: { type: String, unique: true },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);
export default Car;