const DutyRoster = require('../../models/HR/DutyRoster.model');
const asyncHandler = require('express-async-handler');

// @desc    Get duty roster entries within a date range
// @route   GET /api/hr/duty-roster
// @access  Private/Admin
const getRoster = asyncHandler(async (req, res) => {
  const { startDate, endDate, department } = req.query;

  if (!startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide both startDate and endDate');
  }

  let filter = {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };

  const rosters = await DutyRoster.find(filter).populate({
    path: 'employee',
    select: 'name department',
    // Apply department filter if provided
    match: department ? { department: department } : {},
  });
  
  // Filter out null employee entries after population if department filter was used
  const filteredRosters = rosters.filter(roster => roster.employee);

  res.status(200).json(filteredRosters);
});

// @desc    Create a new duty roster entry
// @route   POST /api/hr/duty-roster
// @access  Private/Admin
const createRoster = asyncHandler(async (req, res) => {
  const { employee, date, shift } = req.body;
  if (!employee || !date || !shift) {
    res.status(400);
    throw new Error('Please provide all required fields: employee, date, shift');
  }

  const newRoster = await DutyRoster.create({ employee, date, shift });
  res.status(201).json(newRoster);
});

// @desc    Update a duty roster entry
// @route   PUT /api/hr/duty-roster/:id
// @access  Private/Admin
const updateRoster = asyncHandler(async (req, res) => {
  const roster = await DutyRoster.findById(req.params.id);
  if (!roster) {
    res.status(404);
    throw new Error('Roster entry not found');
  }

  const { employee, date, shift } = req.body;
  roster.employee = employee || roster.employee;
  roster.date = date || roster.date;
  roster.shift = shift || roster.shift;

  const updatedRoster = await roster.save();
  res.status(200).json(updatedRoster);
});

// @desc    Delete a duty roster entry
// @route   DELETE /api/hr/duty-roster/:id
// @access  Private/Admin
const deleteRoster = asyncHandler(async (req, res) => {
  const roster = await DutyRoster.findById(req.params.id);
  if (!roster) {
    res.status(404);
    throw new Error('Roster entry not found');
  }
  await roster.deleteOne();
  res.status(200).json({ message: 'Roster entry removed' });
});

module.exports = { getRoster, createRoster, updateRoster, deleteRoster };