const express = require("express");
const router = express.Router();
const {
  createService,
  getServices,
  updateService,
  deleteService,
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice,
} = require("../../controllers/Billing/billing.controller");
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware");

// Service Routes
router.route("/services").post(authMiddleware, checkRole(['admin']), createService).get(authMiddleware, checkRole(['admin']), getServices);
router
  .route("/services/:id")
  .put(authMiddleware, checkRole(['admin']), updateService)
  .delete(authMiddleware, checkRole(['admin']), deleteService);

// Invoice Routes
router.route("/invoices").post(authMiddleware, checkRole(['admin']), createInvoice).get(authMiddleware, checkRole(['admin']), getInvoices);
router
  .route("/invoices/:id")
  .put(authMiddleware, checkRole(['admin']), updateInvoice)
  .delete(authMiddleware, checkRole(['admin']), deleteInvoice);

module.exports = router;
