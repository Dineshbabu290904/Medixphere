const mongoose = require("mongoose");

const Department = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Department", Department);