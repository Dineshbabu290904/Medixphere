// models/Clinical/ClinicalNote.model.js
const mongoose = require("mongoose");

const ClinicalNoteSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient Detail', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor Detail', required: true },
  subjective: String, // Patient's statements
  objective: String, // Exam findings, vital signs
  assessment: { type: String, required: true }, // Diagnosis, differential
  plan: { type: String, required: true }, // Treatment plan, follow-up
  isSigned: { type: Boolean, default: false } // For digital signature
}, { timestamps: true });

module.exports = mongoose.model("ClinicalNote", ClinicalNoteSchema);