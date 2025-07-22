const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  permissions: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);