const mongoose = require("mongoose");

const accessorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Accessory = mongoose.model("Accessory", accessorySchema);
module.exports = Accessory;