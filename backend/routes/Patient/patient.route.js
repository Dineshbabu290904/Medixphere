const express = require('express');
const router = express.Router();
const {
    getDashboardSummary,
    getMyAppointments,
    getMyPrescriptions,
    getMyLabReports,
    getMyInvoices,
    getAppointmentDetails,
} = require('../../controllers/Patient/patient.controller');
const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware');

// Protect all routes in this file and ensure the user has the 'patient' role
router.use(authMiddleware, checkRole(['patient']));

router.get('/dashboard', getDashboardSummary);
router.get('/appointments', getMyAppointments);
router.get('/prescriptions', getMyPrescriptions);
router.get('/reports', getMyLabReports);
router.get('/invoices', getMyInvoices);
router.get('/appointments/:id', getAppointmentDetails);

module.exports = router;