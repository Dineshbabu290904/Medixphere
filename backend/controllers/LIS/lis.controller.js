const LabTest = require("../../models/LIS/LabTest.model");
const LabReport = require("../../models/LIS/LabReport.model");
const asyncHandler = require("express-async-handler");

// Lab Test Controllers

// @desc    Create a new lab test
// @route   POST /api/lis/lab-tests
// @access  Private/Admin
const createLabTest = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !price || !category) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const labTest = await LabTest.create({ name, description, price, category });

  res.status(201).json(labTest);
});

// @desc    Get all lab tests
// @route   GET /api/lis/lab-tests
// @access  Private/Admin
const getLabTests = asyncHandler(async (req, res) => {
  const labTests = await LabTest.find({});
  res.status(200).json(labTests);
});

// @desc    Get a lab test by ID
// @route   GET /api/lis/lab-tests/:id
// @access  Private/Admin
const getLabTestById = asyncHandler(async (req, res) => {
  const labTest = await LabTest.findById(req.params.id);

  if (!labTest) {
    res.status(404);
    throw new Error("Lab test not found");
  }

  res.status(200).json(labTest);
});

// @desc    Update a lab test
// @route   PUT /api/lis/lab-tests/:id
// @access  Private/Admin
const updateLabTest = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;

  const labTest = await LabTest.findById(req.params.id);

  if (!labTest) {
    res.status(404);
    throw new Error("Lab test not found");
  }

  labTest.name = name || labTest.name;
  labTest.description = description || labTest.description;
  labTest.price = price || labTest.price;
  labTest.category = category || labTest.category;

  const updatedLabTest = await labTest.save();

  res.status(200).json(updatedLabTest);
});

// @desc    Delete a lab test
// @route   DELETE /api/lis/lab-tests/:id
// @access  Private/Admin
const deleteLabTest = asyncHandler(async (req, res) => {
  const labTest = await LabTest.findById(req.params.id);

  if (!labTest) {
    res.status(404);
    throw new Error("Lab test not found");
  }

  await labTest.remove();

  res.status(200).json({ message: "Lab test removed" });
});

// Lab Report Controllers

// @desc    Create a new lab report
// @route   POST /api/lis/lab-reports
// @access  Private/Admin
const createLabReport = asyncHandler(async (req, res) => {
  const { patient, labTest, results, notes } = req.body;

  if (!patient || !labTest || !results) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const labReport = await LabReport.create({ patient, labTest, results, notes });

  res.status(201).json(labReport);
});

const getLabReports = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const labReports = await LabReport.find({}).populate("patient").populate("labTest", "name");
  res.status(200).json(labReports);
});

const getLabReportById = asyncHandler(async (req, res) => {
  // THE FIX: Simplified populate call.
  const labReport = await LabReport.findById(req.params.id).populate("patient").populate("labTest", "name price");
  if (!labReport) { res.status(404); throw new Error("Lab report not found"); }
  res.status(200).json(labReport);
});

const updateLabReport = asyncHandler(async (req, res) => {
  const { patient, labTest, results, notes } = req.body;
  const labReport = await LabReport.findById(req.params.id);

  if (!labReport) {
    res.status(404);
    throw new Error("Lab report not found");
  }

  labReport.patient = patient || labReport.patient;
  labReport.labTest = labTest || labReport.labTest;
  labReport.results = results || labReport.results;
  labReport.notes = notes || labReport.notes;

  const updatedLabReport = await labReport.save();
  res.status(200).json(updatedLabReport);
});

module.exports = {
  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTest,
  deleteLabTest,
  createLabReport,
  getLabReports,
  getLabReportById,
  updateLabReport,
};
