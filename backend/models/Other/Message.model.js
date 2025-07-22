const mongoose = require('mongoose');

// This generic model allows messaging between different user types (Admins, Doctors, etc.)
const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // Note: No 'ref' is used here to keep it generic.
    // We will populate user details manually in the controller.
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);