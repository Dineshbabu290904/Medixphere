const express = require("express");
const { getMedicalTest, addMedicalTest, deleteMedicalTest } = require("../../controllers/Other/medicaltest.controller");
const router = express.Router();
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware.js");

// Protect all medical test routes
router.use(authMiddleware);

// Admins and Doctors can view medical tests
router.get("/getMedicalTest", checkRole(['admin', 'doctor']), getMedicalTest);

// Only Admins can add or delete medical tests
router.post("/addMedicalTest", checkRole(['admin']), addMedicalTest);
router.delete("/deleteMedicalTest/:id", checkRole(['admin']), deleteMedicalTest);

module.exports = router;