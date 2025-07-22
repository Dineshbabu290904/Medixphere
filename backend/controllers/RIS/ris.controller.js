const RadiologyTest = require("../../models/RIS/RadiologyTest.model");
const RadiologyReport = require("../../models/RIS/RadiologyReport.model");
const asyncHandler = require("express-async-handler");

// Radiology Test Controllers

// @desc    Create a new radiology test
// @route   POST /api/ris/radiology-tests
// @access  Private/Admin
const createRadiologyTest = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const radiologyTest = await RadiologyTest.create({ name, description, price, category });

  res.status(201).json(radiologyTest);
});

// @desc    Get all radiology tests
// @route   GET /api/ris/radiology-tests
// @access  Private/Admin
const getRadiologyTests = asyncHandler(async (req, res) => {
  const radiologyTests = await RadiologyTest.find({});
  res.status(200).json(radiologyTests);
});

// @desc    Get a radiology test by ID
// @route   GET /api/ris/radiology-tests/:id
// @access  Private/Admin
const getRadiologyTestById = asyncHandler(async (req, res) => {
  const radiologyTest = await RadiologyTest.findById(req.params.id);

  if (!radiologyTest) {
    res.status(404);
    throw new Error("Radiology test not found");
  }

  res.status(200).json(radiologyTest);
});

// @desc    Update a radiology test
// @route   PUT /api/ris/radiology-tests/:id
// @access  Private/Admin
const updateRadiologyTest = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  const radiologyTest = await RadiologyTest.findById(req.params.id);

  if (!radiologyTest) {
    res.status(404);
    throw new Error("Radiology test not found");
  }

  radiologyTest.name = name || radiologyTest.name;
  radiologyTest.description = description || radiologyTest.description;
  radiologyTest.price = price || radiologyTest.price;
  radiologyTest.category = category || radiologyTest.category;

  const updatedRadiologyTest = await radiologyTest.save();

  res.status(200).json(updatedRadiologyTest);
});

// @desc    Delete a radiology test
// @route   DELETE /api/ris/radiology-tests/:id
// @access  Private/Admin
const deleteRadiologyTest = asyncHandler(async (req, res) => {
  const radiologyTest = await RadiologyTest.findById(req.params.id);

  if (!radiologyTest) {
    res.status(404);
    throw new Error("Radiology test not found");
  }

  await radiologyTest.remove();

  res.status(200).json({ message: "Radiology test removed" });
});

// Radiology Report Controllers

// @desc    Create a new radiology report
// @route   POST /api/ris/radiology-reports
// @access  Private/Admin
const createRadiologyReport = asyncHandler(async (req, res) => {
  const { patient, radiologyTest, results, notes } = req.body;

  if (!patient || !radiologyTest || !results) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const radiologyReport = await RadiologyReport.create({ patient, radiologyTest, results, notes });

  res.status(201).json(radiologyReport);
});

const getRadiologyReports = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const radiologyReports = await RadiologyReport.find({}).populate("patient").populate("radiologyTest", "name");
  res.status(200).json(radiologyReports);
});

const getRadiologyReportById = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const radiologyReport = await RadiologyReport.findById(req.params.id).populate("patient").populate("radiologyTest", "name price");
  if (!radiologyReport) { res.status(404); throw new Error("Radiology report not found"); }
  res.status(200).json(radiologyReport);
});

module.exports = {
  createRadiologyTest,
  getRadiologyTests,
  getRadiologyTestById,
  updateRadiologyTest,
  deleteRadiologyTest,
  createRadiologyReport,
  getRadiologyReports,
  getRadiologyReportById,
};
