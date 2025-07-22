const mongoose = require("mongoose");

const radiologyReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient Detail", // CORRECTED: Was "PatientDetails"
      required: true,
    },
    radiologyTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RadiologyTest",
      required: true,
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    results: {
      type: String,
      required: true,
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

const RadiologyReport = mongoose.model("RadiologyReport", radiologyReportSchema);

module.exports = RadiologyReport;