const mongoose = require("mongoose");

const PatientRecord = new mongoose.Schema({
  doctorName: {
    type: String,
    required: true,
  },
  patientId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("PatientRecord", PatientRecord);