const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient Detail", // CORRECTED: Was "PatientDetails"
      required: true,
    },
    labTest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabTest",
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

const LabReport = mongoose.model("LabReport", labReportSchema);

module.exports = LabReport;