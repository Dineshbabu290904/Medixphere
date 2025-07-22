// models/Patient/VitalsHistory.model.js
const mongoose = require("mongoose");
const VitalsHistorySchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient Detail', required: true },
  date: { type: Date, default: Date.now },
  pulse: Number, bp_systolic: Number, bp_diastolic: Number, temp: Number, spo2: Number,
  weight: Number, height: Number, bmi: Number, // BMI can be calculated or stored
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor Detail' } // Or Receptionist/Nurse Detail
}, { timestamps: true });
module.exports = mongoose.model("VitalsHistory", VitalsHistorySchema);