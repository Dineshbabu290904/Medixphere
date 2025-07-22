const mongoose = require("mongoose");

const dispenseSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient Detail", // CORRECTED: Was "PatientDetails"
      required: true,
    },
    medicines: [
      {
        medicine: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        _id: false
      },
    ],
    dispenseDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dispense = mongoose.model("Dispense", dispenseSchema);

module.exports = Dispense;