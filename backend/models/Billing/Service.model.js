const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Consultation", "Lab Test", "Procedure", "Room Charge", "Other"],
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
