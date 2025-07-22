const express = require("express");
const router = express.Router();
const { getChart, addTimeSlot, updateTimeSlot } = require("../../controllers/Other/criticalCareChart.controller.js");
const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware');

// Protect all routes, accessible by doctors and nurses (assuming nurses might also edit)
router.use(authMiddleware, checkRole(['doctor', 'nurse']));

// Get a patient's full chart data
router.get("/get/:patientId", getChart);

// Add a new time slot to the chart
router.post("/add/:patientId", addTimeSlot);

// Update a specific time slot
router.put("/update/:patientId/:dayId/:slotId", updateTimeSlot);

module.exports = router;