const mongoose = require("mongoose");

// This model is used to generate auto-incrementing IDs for different roles
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model("Counter", CounterSchema);