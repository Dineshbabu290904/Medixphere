const express = require("express");
const router = express.Router();
const { getDepartment, addDepartment, deleteDepartment } = require("../../controllers/Other/department.controller.js");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware.js");

router.use(authMiddleware); // Protect all routes in this file

router.get("/getDepartment", checkRole(['admin', 'doctor', 'receptionist', 'patient']), getDepartment);
router.post("/addDepartment", checkRole(['admin']), addDepartment);
router.delete("/deleteDepartment/:id", checkRole(['admin']), deleteDepartment);

module.exports = router;