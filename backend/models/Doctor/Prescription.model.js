const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient Detail', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor Detail', required: true },
  date: { type: Date, default: Date.now },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true }, // e.g., "500mg"
    frequency: { type: String, required: true }, // e.g., "1-1-1" or "Twice a day"
    duration: { type: String }, // e.g., "5 days"
    _id: false,
  }],
  notes: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);