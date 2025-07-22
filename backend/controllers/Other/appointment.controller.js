const Appointment = require('../../models/Other/appointment.model');
const mongoose = require('mongoose');
const logActivity = require('../../utils/activityLogger').logActivity;

const createAppointment = async (req, res) => {
    const { patientId, doctorId, appointmentDate, slot, notes } = req.body;

    if (!patientId || !doctorId || !appointmentDate || !slot) {
        return res.status(400).json({ success: false, message: 'Patient, doctor, date, and slot are required.' });
    }

    try {
        const appointment = new Appointment({ patientId, doctorId, appointmentDate, slot, notes });
        const createdAppointment = await appointment.save();
        await logActivity('APPOINTMENT_CREATED', `New appointment booked for Patient ID: ${patientId} with Doctor ID: ${doctorId}.`);
        res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment: createdAppointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    try {
        const { doctorId, patientId } = req.query; 
        let filter = {};

        if (doctorId && mongoose.Types.ObjectId.isValid(doctorId)) {
            filter.doctorId = doctorId;
        }

        if (patientId && mongoose.Types.ObjectId.isValid(patientId)) {
            filter.patientId = patientId;
        }

        const appointments = await Appointment.find(filter)
            // --- BUG FIX: Added 'gender' and 'phoneNumber' to the select statement ---
            .populate({ path: 'patientId', select: 'firstName lastName patientId profile gender phoneNumber' }) 
            .populate({ path: 'doctorId', select: 'firstName lastName department profile' })
            .sort({ appointmentDate: -1, slot: 1 }); // Also sort by slot for consistency

        res.json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const updateAppointment = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    try {
        const appointment = await Appointment.findById(req.params.id);
        if (appointment) {
            appointment.status = status;
            await appointment.save();

            await logActivity('APPOINTMENT_STATUS_UPDATED', `Appointment for patient ID ${appointment.patientId} was updated to ${status}.`);

            res.json({ success: true, message: `Appointment marked as ${status}` });
        } else {
            res.status(404).json({ success: false, message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (appointment) {
            appointment.status = 'Cancelled';
            await appointment.save();
            res.json({ success: true, message: 'Appointment cancelled' });
        } else {
            res.status(404).json({ success: false, message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

const getAppointmentCount = async (req, res) => {
    try {
        const count = await Appointment.countDocuments(req.query);
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { createAppointment, getAllAppointments, updateAppointment, cancelAppointment, getAppointmentCount };