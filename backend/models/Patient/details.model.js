const mongoose = require("mongoose");

const FamilyMemberSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient Detail', required: true },
    relationship: { type: String, required: true },
    isPrimaryContact: { type: Boolean, default: false }
}, { _id: false });

const patientDetails = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String },
  phoneNumber: {
    type: Number,
    required: true,
    index: true
  },
  dateOfBirth: { type: Date, required: true },
  bloodGroup: { type: String, required: true },
  address: { type: String, required: true },
  gender: { type: String, required: true },
  profile: { type: String, required: true },
  family: [FamilyMemberSchema],
}, { 
    timestamps: true,
    // *** THE FIX - PART 1: Enable virtuals in the output ***
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// *** THE FIX - PART 2: Create a virtual 'name' property ***
patientDetails.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("Patient Detail", patientDetails);