const moment = require('moment');
const asyncHandler = require('express-async-handler');
const Appointment = require('../../models/Other/appointment.model');
const Prescription = require('../../models/Doctor/Prescription.model');
const LabReport = require('../../models/LIS/LabReport.model');
const Invoice = require('../../models/Billing/Invoice.model');
const Patient = require('../../models/Patient/details.model');
const ClinicalNote = require('../../models/Clinical/ClinicalNote.model');


// @desc    Get patient's dashboard summary
// @route   GET /api/patient/dashboard
const getDashboardSummary = asyncHandler(async (req, res) => {
    // req.user.id is the MongoDB _id of the Patient Detail document from the auth middleware
    const patientId = req.user.id;

    const upcomingAppointments = await Appointment.find({
        patientId: patientId,
        status: { $in: ['Scheduled', 'Confirmed'] },
        appointmentDate: { $gte: new Date() }
    }).sort({ appointmentDate: 1 }).limit(5).populate('doctorId', 'firstName lastName department');
    
    const recentPrescriptions = await Prescription.find({ patient: patientId })
        .sort({ date: -1 }).limit(5).populate('doctor', 'firstName lastName');
        
    const recentReports = await LabReport.find({ patient: patientId })
        .sort({ reportDate: -1 }).limit(5).populate('labTest', 'name');

    res.json({
        upcomingAppointments,
        recentPrescriptions,
        recentReports,
    });
});

// @desc    Get all appointments for the logged-in patient
// @route   GET /api/patient/appointments
const getMyAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ patientId: req.user.id })
        .sort({ appointmentDate: -1 })
        .populate('doctorId', 'firstName lastName department');
    res.json(appointments);
});

// @desc    Get all prescriptions for the logged-in patient
// @route   GET /api/patient/prescriptions
const getMyPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await Prescription.find({ patient: req.user.id })
        .sort({ date: -1 })
        .populate('doctor', 'firstName lastName department');
    res.json(prescriptions);
});

// @desc    Get all lab reports for the logged-in patient
// @route   GET /api/patient/reports
const getMyLabReports = asyncHandler(async (req, res) => {
    const reports = await LabReport.find({ patient: req.user.id })
        .sort({ reportDate: -1 })
        .populate('labTest', 'name price');
    res.json(reports);
});

// @desc    Get all invoices for the logged-in patient
// @route   GET /api/patient/invoices
const getMyInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find({ patient: req.user.id })
        .sort({ invoiceDate: -1 });
    res.json(invoices);
});

const getAppointmentDetails = asyncHandler(async (req, res) => {
    const appointmentId = req.params.id;
    const patientId = req.user.id;

    // 1. Fetch the appointment and verify it belongs to the logged-in patient
    const appointment = await Appointment.findOne({ _id: appointmentId, patientId: patientId })
        .populate('doctorId', 'firstName lastName department');

    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found or you do not have permission to view it.');
    }

    // 2. Find the clinical note that was created on the same day as the appointment
    // Note: This assumes one main note per day. More complex logic could link notes directly.
    const appointmentDate = moment(appointment.appointmentDate).startOf('day');
    const nextDay = moment(appointmentDate).endOf('day');

    const clinicalNote = await ClinicalNote.findOne({
        patientId: patientId,
        doctorId: appointment.doctorId._id,
        createdAt: {
            $gte: appointmentDate.toDate(),
            $lt: nextDay.toDate()
        }
    }).sort({ createdAt: -1 }); // Get the latest note of that day

    // 3. Find the prescription created on the same day
    const prescription = await Prescription.findOne({
        patient: patientId,
        doctor: appointment.doctorId._id,
        date: {
            $gte: appointmentDate.toDate(),
            $lt: nextDay.toDate()
        }
    }).sort({ date: -1 });

    res.json({
        appointment,
        clinicalNote,
        prescription
    });
});

module.exports = {
    getDashboardSummary,
    getMyAppointments,
    getMyPrescriptions,
    getMyLabReports,
    getMyInvoices,
    getAppointmentDetails, // <-- Export the new function
};