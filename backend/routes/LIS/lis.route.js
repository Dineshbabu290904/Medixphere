const express = require("express");
const router = express.Router();
const {
  createLabTest,
  getLabTests,
  getLabTestById,
  updateLabTest,
  deleteLabTest,
  createLabReport,
  getLabReports,
  getLabReportById,
  updateLabReport,
} = require("../../controllers/LIS/lis.controller");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware");

// Lab Test Routes
router.route("/lab-tests").post(authMiddleware, checkRole(['admin']), createLabTest).get(authMiddleware, checkRole(['admin']), getLabTests);
router
  .route("/lab-tests/:id")
  .get(authMiddleware, checkRole(['admin']), getLabTestById)
  .put(authMiddleware, checkRole(['admin']), updateLabTest)
  .delete(authMiddleware, checkRole(['admin']), deleteLabTest);

// Lab Report Routes
router.route("/lab-reports").post(authMiddleware, checkRole(['admin']), createLabReport).get(authMiddleware, checkRole(['admin']), getLabReports);
router.route("/lab-reports/:id")
  .get(authMiddleware, checkRole(['admin']), getLabReportById)
  .put(authMiddleware, checkRole(['admin']), updateLabReport);

module.exports = router;
