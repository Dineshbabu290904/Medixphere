const mongoose = require("mongoose");

const MedicalTest = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("MedicalTest", MedicalTest);