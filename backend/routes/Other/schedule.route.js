const express = require("express");
const router = express.Router();
const { getSchedule, addOrUpdateSchedule, deleteSchedule, getDoctorAvailability, exportSchedule } = require("../../controllers/Other/schedule.controller.js");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware.js");

router.use(authMiddleware);

router.post("/getSchedule", checkRole(['admin', 'doctor', 'receptionist']), getSchedule); 
router.post("/addOrUpdateSchedule", checkRole(['admin', 'doctor']), addOrUpdateSchedule); 
router.delete("/deleteSchedule/:id", checkRole(['admin']), deleteSchedule);
router.get("/getDoctorAvailability", checkRole(['admin', 'receptionist', 'patient']), getDoctorAvailability);

// NEW ROUTE for exporting schedule data
router.get("/export", checkRole(['doctor']), exportSchedule);

module.exports = router;