const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  createDutyRoster,
  getDutyRoster,
} = require("../../controllers/HR/hr.controller");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware");

// Employee Routes
router.route("/employees").post(authMiddleware, checkRole(['admin']), createEmployee).get(authMiddleware, checkRole(['admin']), getEmployees);
router
  .route("/employees/:id")
  .get(authMiddleware, checkRole(['admin']), getEmployeeById)
  .put(authMiddleware, checkRole(['admin']), updateEmployee)
  .delete(authMiddleware, checkRole(['admin']), deleteEmployee);

// Duty Roster Routes
router.route("/duty-roster").post(authMiddleware, checkRole(['admin']), createDutyRoster).get(authMiddleware, checkRole(['admin']), getDutyRoster);

module.exports = router;
