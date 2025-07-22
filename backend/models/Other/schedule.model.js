const mongoose = require("mongoose");

const WorkingDaySchema = new mongoose.Schema({
  dayOfWeek: { // e.g., 'Monday', 'Tuesday'
    type: String,
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true,
  },
  startTime: { // e.g., "09:00" (24-hour format)
    type: String,
    required: true,
    match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format validation
  },
  endTime: { // e.g., "17:00" (24-hour format)
    type: String,
    required: true,
    match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/
  },
  slotDuration: { // in minutes, e.g., 15, 30, 60
    type: Number,
    default: 30,
    min: 5
  },
  breaks: [{ // Optional breaks within working hours
    breakStart: { type: String, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ },
    breakEnd: { type: String, match: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/ },
    _id: false // No _id for sub-documents in array
  }]
}, { _id: false });

const ScheduleSchema = new mongoose.Schema({
  doctorId: { // Link to Doctor Detail
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor Detail',
    required: true,
    unique: true, // A doctor has only one schedule document
  },
  workingDays: [WorkingDaySchema],
}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);