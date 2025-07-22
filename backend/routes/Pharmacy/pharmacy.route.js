const express = require("express");
const router = express.Router();
const {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  createDispense,
  getDispenses,
  getDispenseById,
} = require("../../controllers/Pharmacy/pharmacy.controller");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware");

// Medicine Routes
router.route("/medicines").post(authMiddleware, checkRole(['admin']), createMedicine).get(authMiddleware, checkRole(['admin']), getMedicines);
router
  .route("/medicines/:id")
  .get(authMiddleware, checkRole(['admin']), getMedicineById)
  .put(authMiddleware, checkRole(['admin']), updateMedicine)
  .delete(authMiddleware, checkRole(['admin']), deleteMedicine);

// Dispense Routes
router.route("/dispenses").post(authMiddleware, checkRole(['admin']), createDispense).get(authMiddleware, checkRole(['admin']), getDispenses);
router.route("/dispenses/:id").get(authMiddleware, checkRole(['admin']), getDispenseById);

module.exports = router;
