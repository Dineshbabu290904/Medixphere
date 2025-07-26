const express = require("express");
const router = express.Router();
const {
    getChart,
    updateChartHeader,
    upsertTimeSlot,
    updateDayData,
    deleteTimeSlot,
    getChartAnalytics
} = require("../../controllers/Other/criticalCareChart.controller.js");
const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware');

// Protect all routes
router.use(authMiddleware);

// Get a patient's full chart data
router.get("/get/:patientId", checkRole(['doctor', 'nurse', 'admin']), getChart);

// Get chart analytics and summary
router.get("/analytics/:patientId", checkRole(['doctor', 'nurse', 'admin']), getChartAnalytics);

// Update chart header information
router.put("/header/:patientId", checkRole(['doctor', 'nurse']), updateChartHeader);

// Add or update a time slot (upsert)
router.post("/slot/:patientId", checkRole(['doctor', 'nurse']), upsertTimeSlot);

// Update day-level data (IV fluids, drugs, etc.)
router.put("/day/:patientId", checkRole(['doctor', 'nurse']), updateDayData);

// Delete a specific time slot
router.delete("/slot/:patientId/:dayId/:slotId", checkRole(['doctor', 'admin']), deleteTimeSlot);

// Legacy routes for backward compatibility
router.post("/add/:patientId", checkRole(['doctor', 'nurse']), upsertTimeSlot);
router.put("/update/:patientId/:dayId/:slotId", checkRole(['doctor', 'nurse']), upsertTimeSlot);

module.exports = router;