const express = require("express");
const router = express.Router();
const {
  createRadiologyTest,
  getRadiologyTests,
  getRadiologyTestById,
  updateRadiologyTest,
  deleteRadiologyTest,
  createRadiologyReport,
  getRadiologyReports,
  getRadiologyReportById,
} = require("../../controllers/RIS/ris.controller");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware");

// Radiology Test Routes
router.route("/radiology-tests").post(authMiddleware, checkRole(['admin']), createRadiologyTest).get(authMiddleware, checkRole(['admin']), getRadiologyTests);
router
  .route("/radiology-tests/:id")
  .get(authMiddleware, checkRole(['admin']), getRadiologyTestById)
  .put(authMiddleware, checkRole(['admin']), updateRadiologyTest)
  .delete(authMiddleware, checkRole(['admin']), deleteRadiologyTest);

// Radiology Report Routes
router.route("/radiology-reports").post(authMiddleware, checkRole(['admin']), createRadiologyReport).get(authMiddleware, checkRole(['admin']), getRadiologyReports);
router.route("/radiology-reports/:id").get(authMiddleware, checkRole(['admin']), getRadiologyReportById);

module.exports = router;
