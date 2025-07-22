const express = require("express");
const router = express.Router();
const { getPatientRecord, addPatientRecord, updatePatientRecord, deletePatientRecord } = require("../../controllers/Other/patientrecord.controller.js");
const upload = require("../../middlewares/multer.middleware.js");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware.js");

// All routes here are protected
router.use(authMiddleware);

router.post("/getPatientRecord", checkRole(['doctor', 'patient', 'admin']), getPatientRecord);
router.post("/addPatientRecord", checkRole(['doctor', 'admin']), upload.single("record"), addPatientRecord);
router.put("/updatePatientRecord/:id", checkRole(['doctor', 'admin']), updatePatientRecord);
router.delete("/deletePatientRecord/:id", checkRole(['admin']), deletePatientRecord);

module.exports = router;