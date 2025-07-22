const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ward",
      required: true,
    },
    isOccupied: {
      type: Boolean,
      default: false,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient Detail", // CORRECTED: Was "PatientDetails"
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Bed = mongoose.model("Bed", bedSchema);

module.exports = Bed;