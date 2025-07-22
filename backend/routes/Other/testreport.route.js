const express = require("express");
const { getTestReport, addTestReport, deleteTestReport } = require("../../controllers/Other/testreport.controller");
const router = express.Router();
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware.js");

// Protect all test report routes
router.use(authMiddleware);

// Patients can get their own reports, Doctors and Admins can get reports based on query
router.post("/getTestReport", checkRole(['admin', 'doctor', 'patient']), getTestReport);

// Doctors and Admins can add/update reports
router.post("/addTestReport", checkRole(['admin', 'doctor']), addTestReport);

// Only Admins can delete reports
router.delete("/deleteTestReport/:id", checkRole(['admin']), deleteTestReport);

module.exports = router;