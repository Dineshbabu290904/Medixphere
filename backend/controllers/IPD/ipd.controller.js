const Ward = require("../../models/IPD/Ward.model");
const Bed = require("../../models/IPD/Bed.model");
const asyncHandler = require("express-async-handler");

// Ward Controllers

// @desc    Create a new ward
// @route   POST /api/ipd/wards
// @access  Private/Admin
const createWard = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please provide a ward name");
  }

  const ward = await Ward.create({ name, description });

  res.status(201).json(ward);
});

// @desc    Get all wards
// @route   GET /api/ipd/wards
// @access  Private/Admin
const getWards = asyncHandler(async (req, res) => {
  const wards = await Ward.find({});
  res.status(200).json(wards);
});

// @desc    Get a ward by ID
// @route   GET /api/ipd/wards/:id
// @access  Private/Admin
const getWardById = asyncHandler(async (req, res) => {
  const ward = await Ward.findById(req.params.id);

  if (!ward) {
    res.status(404);
    throw new Error("Ward not found");
  }

  res.status(200).json(ward);
});

// @desc    Update a ward
// @route   PUT /api/ipd/wards/:id
// @access  Private/Admin
const updateWard = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const ward = await Ward.findById(req.params.id);

  if (!ward) {
    res.status(404);
    throw new Error("Ward not found");
  }

  ward.name = name || ward.name;
  ward.description = description || ward.description;

  const updatedWard = await ward.save();

  res.status(200).json(updatedWard);
});

// @desc    Delete a ward
// @route   DELETE /api/ipd/wards/:id
// @access  Private/Admin
const deleteWard = asyncHandler(async (req, res) => {
  const ward = await Ward.findById(req.params.id);

  if (!ward) {
    res.status(404);
    throw new Error("Ward not found");
  }

  await Bed.deleteMany({ ward: ward._id });

  await ward.remove();

  res.status(200).json({ message: "Ward and all associated beds removed" });
});

// Bed Controllers

// @desc    Create a new bed
// @route   POST /api/ipd/beds
// @access  Private/Admin
const createBed = asyncHandler(async (req, res) => {
  const { bedNumber, ward } = req.body;

  if (!bedNumber || !ward) {
    res.status(400);
    throw new Error("Please provide bed number and ward");
  }

  const bed = await Bed.create({ bedNumber, ward });

  res.status(201).json(bed);
});

const getBeds = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const beds = await Bed.find({}).populate("ward", "name").populate("patient");
  res.status(200).json(beds);
});

const getBedById = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const bed = await Bed.findById(req.params.id).populate("ward", "name").populate("patient");
  if (!bed) { res.status(404); throw new Error("Bed not found"); }
  res.status(200).json(bed);
});
// @desc    Assign a patient to a bed
// @route   PUT /api/ipd/beds/:id/assign
// @access  Private/Admin
const assignPatientToBed = asyncHandler(async (req, res) => {
  const { patientId } = req.body;

  const bed = await Bed.findById(req.params.id);

  if (!bed) {
    res.status(404);
    throw new Error("Bed not found");
  }

  bed.patient = patientId;
  bed.isOccupied = true;

  const updatedBed = await bed.save();

  res.status(200).json(updatedBed);
});

// @desc    Discharge a patient from a bed
// @route   PUT /api/ipd/beds/:id/discharge
// @access  Private/Admin
const dischargePatientFromBed = asyncHandler(async (req, res) => {
  const bed = await Bed.findById(req.params.id);

  if (!bed) {
    res.status(404);
    throw new Error("Bed not found");
  }

  bed.patient = null;
  bed.isOccupied = false;

  const updatedBed = await bed.save();

  res.status(200).json(updatedBed);
});

module.exports = {
  createWard,
  getWards,
  getWardById,
  updateWard,
  deleteWard,
  createBed,
  getBeds,
  getBedById,
  assignPatientToBed,
  dischargePatientFromBed,
};
