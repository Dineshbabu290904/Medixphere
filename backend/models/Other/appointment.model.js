const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient Detail', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor Detail', required: true },
  appointmentDate: { type: Date, required: true },
  slot: { type: String, required: true },
  appointmentType: { type: String },
  status: { 
    type: String, 
    required: true, 
    // THE FIX: Added all new statuses to the enum
    enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'],
    default: 'Scheduled' 
  },
  notes: { type: String, trim: true },
  consultationNotes: { type: String, trim: true },
}, { timestamps: true });

AppointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);