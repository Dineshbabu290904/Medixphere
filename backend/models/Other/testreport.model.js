const mongoose = require("mongoose");

const TestReport = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
  },
  results: {
    type: {},
  }
}, { timestamps: true });

module.exports = mongoose.model("TestReport", TestReport);