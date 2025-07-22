const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    // e.g., 'USER_CREATED', 'APPOINTMENT_BOOKED', 'NOTICE_POSTED'
  },
  description: {
    type: String,
    required: true,
    // e.g., "Admin Jane Doe created new patient John Smith (PAT001)."
  },
  user: { // The user who performed the action
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'userModel'
  },
  userModel: {
    type: String,
    enum: ['Admin Detail', 'Doctor Detail'] // Extend as needed
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for faster querying
ActivityLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);