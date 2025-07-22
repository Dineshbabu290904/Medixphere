const mongoose = require("mongoose");

const radiologyTestSchema = new mongoose.Schema(
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

const RadiologyTest = mongoose.model("RadiologyTest", radiologyTestSchema);

module.exports = RadiologyTest;
