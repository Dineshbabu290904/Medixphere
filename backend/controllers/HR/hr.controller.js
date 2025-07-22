const Employee = require("../../models/HR/Employee.model");
const DutyRoster = require("../../models/HR/DutyRoster.model");
const asyncHandler = require("express-async-handler");

// Employee Controllers

// @desc    Create a new employee
// @route   POST /api/hr/employees
// @access  Private/Admin
const createEmployee = asyncHandler(async (req, res) => {
  const { name, employeeId, role, department, joiningDate, contactNumber, email } = req.body;

  if (!name || !employeeId || !role || !department || !joiningDate || !contactNumber || !email) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const employee = await Employee.create({ name, employeeId, role, department, joiningDate, contactNumber, email });

  res.status(201).json(employee);
});

// @desc    Get all employees
// @route   GET /api/hr/employees
// @access  Private/Admin
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  res.status(200).json(employees);
});

// @desc    Get an employee by ID
// @route   GET /api/hr/employees/:id
// @access  Private/Admin
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  res.status(200).json(employee);
});

// @desc    Update an employee
// @route   PUT /api/hr/employees/:id
// @access  Private/Admin
const updateEmployee = asyncHandler(async (req, res) => {
  const { name, employeeId, role, department, joiningDate, contactNumber, email } = req.body;

  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  employee.name = name || employee.name;
  employee.employeeId = employeeId || employee.employeeId;
  employee.role = role || employee.role;
  employee.department = department || employee.department;
  employee.joiningDate = joiningDate || employee.joiningDate;
  employee.contactNumber = contactNumber || employee.contactNumber;
  employee.email = email || employee.email;

  const updatedEmployee = await employee.save();

  res.status(200).json(updatedEmployee);
});

// @desc    Delete an employee
// @route   DELETE /api/hr/employees/:id
// @access  Private/Admin
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    res.status(404);
    throw new Error("Employee not found");
  }

  await employee.remove();

  res.status(200).json({ message: "Employee removed" });
});

// Duty Roster Controllers

// @desc    Create a new duty roster entry
// @route   POST /api/hr/duty-roster
// @access  Private/Admin
const createDutyRoster = asyncHandler(async (req, res) => {
  const { employee, shift, date } = req.body;

  if (!employee || !shift || !date) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const dutyRoster = await DutyRoster.create({ employee, shift, date });

  res.status(201).json(dutyRoster);
});

// @desc    Get all duty roster entries
// @route   GET /api/hr/duty-roster
// @access  Private/Admin
const getDutyRoster = asyncHandler(async (req, res) => {
  const dutyRoster = await DutyRoster.find({}).populate("employee", "name");
  res.status(200).json(dutyRoster);
});

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  createDutyRoster,
  getDutyRoster,
};
