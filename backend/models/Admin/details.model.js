const mongoose = require("mongoose");

const adminDetails = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true, // Enforce uniqueness at the database level
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure emails are unique
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Admin Detail", adminDetails);