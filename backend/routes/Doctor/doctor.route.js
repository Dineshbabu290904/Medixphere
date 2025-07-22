const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    getMyPatients, 
    getPatientDetails, 
    createClinicalNote, 
    createPrescription, 
    getLabReports, 
    getAnalytics, 
    getAppointments, 
    getPrescriptions 
} = require('../../controllers/Doctor/doctor.controller');
const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware');

// Protect all doctor routes and ensure the user has the 'doctor' role
router.use(authMiddleware, checkRole(['doctor']));

router.get('/dashboard', getDashboardStats);
router.get('/my-patients', getMyPatients);
router.get('/lab-reports', getLabReports);
router.get('/analytics', getAnalytics);
router.get('/appointments', getAppointments);
router.get('/prescriptions', getPrescriptions);

// Routes with patient ID parameter
router.get('/patients/:id', getPatientDetails);
router.post('/patients/:id/notes', createClinicalNote);
router.post('/patients/:id/prescriptions', createPrescription);

module.exports = router;