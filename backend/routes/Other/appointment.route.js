const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAllAppointments,
    updateAppointment,
    cancelAppointment,
    getAppointmentCount
} = require('../../controllers/Other/appointment.controller');
const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.post('/create', checkRole(['admin', 'receptionist', 'patient']), createAppointment); // Assuming receptionist role
router.get('/getAll', checkRole(['admin', 'doctor', 'receptionist']), getAllAppointments); 
router.put('/update/:id', checkRole(['admin', 'doctor', 'receptionist', 'patient']), updateAppointment);
router.delete('/cancel/:id', checkRole(['admin', 'receptionist', 'patient']), cancelAppointment);
router.get('/count', checkRole(['admin', 'doctor', 'receptionist']), getAppointmentCount);

module.exports = router;