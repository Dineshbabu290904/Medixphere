const Medicine = require("../../models/Pharmacy/Medicine.model");
const Dispense = require("../../models/Pharmacy/Dispense.model");
const asyncHandler = require("express-async-handler");

// Medicine Controllers

// @desc    Create a new medicine
// @route   POST /api/pharmacy/medicines
// @access  Private/Admin
const createMedicine = asyncHandler(async (req, res) => {
  const { name, description, stock, unit, price, expiryDate, supplier } = req.body;

  if (!name || !stock || !unit || !price || !expiryDate) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const medicine = await Medicine.create({ name, description, stock, unit, price, expiryDate, supplier });

  res.status(201).json(medicine);
});

// @desc    Get all medicines
// @route   GET /api/pharmacy/medicines
// @access  Private/Admin
const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({});
  res.status(200).json(medicines);
});

// @desc    Get a medicine by ID
// @route   GET /api/pharmacy/medicines/:id
// @access  Private/Admin
const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  res.status(200).json(medicine);
});

// @desc    Update a medicine
// @route   PUT /api/pharmacy/medicines/:id
// @access  Private/Admin
const updateMedicine = asyncHandler(async (req, res) => {
  const { name, description, stock, unit, price, expiryDate, supplier } = req.body;

  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  medicine.name = name || medicine.name;
  medicine.description = description || medicine.description;
  medicine.stock = stock || medicine.stock;
  medicine.unit = unit || medicine.unit;
  medicine.price = price || medicine.price;
  medicine.expiryDate = expiryDate || medicine.expiryDate;
  medicine.supplier = supplier || medicine.supplier;

  const updatedMedicine = await medicine.save();

  res.status(200).json(updatedMedicine);
});

// @desc    Delete a medicine
// @route   DELETE /api/pharmacy/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  await medicine.remove();

  res.status(200).json({ message: "Medicine removed" });
});

// Dispense Controllers

// @desc    Create a new dispense record
// @route   POST /api/pharmacy/dispenses
// @access  Private/Admin
const createDispense = asyncHandler(async (req, res) => {
  const { patient, medicines, notes } = req.body;

  if (!patient || !medicines || medicines.length === 0) {
    res.status(400);
    throw new Error("Please provide patient and at least one medicine");
  }

  for (const item of medicines) {
    const medicine = await Medicine.findById(item.medicine);
    if (!medicine) {
      res.status(404);
      throw new Error(`Medicine with ID ${item.medicine} not found`);
    }
    if (medicine.stock < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${medicine.name}`);
    }
    medicine.stock -= item.quantity;
    await medicine.save();
  }

  const dispense = await Dispense.create({ patient, medicines, notes });

  res.status(201).json(dispense);
});

const getDispenses = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const dispenses = await Dispense.find({}).populate("patient").populate("medicines.medicine", "name");
  res.status(200).json(dispenses);
});

const getDispenseById = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const dispense = await Dispense.findById(req.params.id).populate("patient").populate("medicines.medicine", "name price");
  if (!dispense) { res.status(404); throw new Error("Dispense record not found"); }
  res.status(200).json(dispense);
});

module.exports = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  createDispense,
  getDispenses,
  getDispenseById,
};
