const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema(
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
    },
  },
  {
    timestamps: true,
  }
);

const LabTest = mongoose.model("LabTest", labTestSchema);

module.exports = LabTest;
