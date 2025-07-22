const asyncHandler = require('express-async-handler');
const Admin = require('../../models/Admin/details.model');
const Doctor = require('../../models/Doctor/details.model');
const Employee = require('../../models/HR/Employee.model');

// @desc    Get all staff users (non-patients) for messaging
// @route   GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const admins = await Admin.find({}, 'firstName lastName').lean();
  const doctors = await Doctor.find({}, 'firstName lastName department').lean();
  const otherStaff = await Employee.find({}, 'name role').lean();

  const users = [
    ...admins.map(u => ({ ...u, id: u._id, role: 'Admin' })),
    ...doctors.map(u => ({ ...u, id: u._id, role: 'Doctor' })),
    ...otherStaff.map(s => ({ id: s._id, firstName: s.name, lastName: `(${s.role})`, role: s.role }))
  ];

  // Filter out the current logged-in user from the list
  const filteredUsers = users.filter(user => user.id.toString() !== req.user.id.toString());

  res.json(filteredUsers);
});

module.exports = { getUsers };