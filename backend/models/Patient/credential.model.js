const mongoose = require("mongoose");

const patientCredential = new mongoose.Schema({
  loginid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Patient Credential", patientCredential);