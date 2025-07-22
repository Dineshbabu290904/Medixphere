const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["Tablet", "Capsule", "Syrup", "Injection", "Ointment", "Other"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    supplier: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
