const express = require("express");
const router = express.Router();
const {
  createWard,
  getWards,
  getWardById,
  updateWard,
  deleteWard,
  createBed,
  getBeds,
  getBedById,
  assignPatientToBed,
  dischargePatientFromBed,
} = require("../../controllers/IPD/ipd.controller");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware");

// Ward Routes
router.route("/wards").post(authMiddleware, checkRole(['admin']), createWard).get(authMiddleware, checkRole(['admin']), getWards);
router
  .route("/wards/:id")
  .get(authMiddleware, checkRole(['admin']), getWardById)
  .put(authMiddleware, checkRole(['admin']), updateWard)
  .delete(authMiddleware, checkRole(['admin']), deleteWard);

// Bed Routes
router.route("/beds").post(authMiddleware, checkRole(['admin']), createBed).get(authMiddleware, checkRole(['admin']), getBeds);
router.route("/beds/:id").get(authMiddleware, checkRole(['admin']), getBedById);
router.route("/beds/:id/assign").put(authMiddleware, checkRole(['admin']), assignPatientToBed);
router.route("/beds/:id/discharge").put(authMiddleware, checkRole(['admin']), dischargePatientFromBed);

module.exports = router;
