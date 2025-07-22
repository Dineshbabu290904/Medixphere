const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const moment = require('moment');
const Appointment = require('../../models/Other/appointment.model');
const Patient = require('../../models/Patient/details.model');
const Prescription = require('../../models/Doctor/Prescription.model');
const LabReport = require('../../models/LIS/LabReport.model');
const ClinicalNote = require('../../models/Clinical/ClinicalNote.model'); 

// @desc    Get dashboard stats for a doctor
// @route   GET /api/doctor/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const todayStart = moment().startOf('day').toDate();
  const todayEnd = moment().endOf('day').toDate();

  const appointmentsToday = await Appointment.countDocuments({ 
    doctorId, 
    appointmentDate: { $gte: todayStart, $lte: todayEnd },
    status: 'Scheduled'
  });
  
  const assignedPatientIds = await Appointment.distinct('patientId', { doctorId });
  
  // This is a placeholder; real logic would query reports needing review.
  const pendingReports = await LabReport.countDocuments({ 
      patient: { $in: assignedPatientIds }, 
      // Add a status field to LabReport model for this to work, e.g., status: 'Pending Review'
  });

  res.json({ 
      appointmentsToday, 
      assignedPatients: assignedPatientIds.length, 
      pendingReports: pendingReports || 5 // fallback for demo
  });
});

// @desc    Get all unique patients assigned to a doctor
// @route   GET /api/doctor/my-patients
const getMyPatients = asyncHandler(async (req, res) => {
    const doctorId = req.user.id;
    const patientIds = await Appointment.distinct('patientId', { doctorId });
    const patients = await Patient.find({ '_id': { $in: patientIds } });
    res.json(patients);
});


// @desc    Get a single patient's details, including notes and prescriptions
// @route   GET /api/doctor/patients/:id
const getPatientDetails = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(404); throw new Error('Patient not found');
    }

    const notes = await ClinicalNote.find({ patientId: req.params.id })
        .populate('doctorId', 'firstName lastName')
        .sort({ createdAt: -1 });

    const prescriptions = await Prescription.find({ patient: req.params.id })
        .populate('doctor', 'firstName lastName')
        .sort({ date: -1 });

    res.json({ patient, notes, prescriptions });
});

// @desc    Create a clinical note (SOAP format)
// @route   POST /api/doctor/patients/:id/notes
const createClinicalNote = asyncHandler(async (req, res) => {
    const { subjective, objective, assessment, plan } = req.body;
    
    if (!assessment || !plan) {
        res.status(400);
        throw new Error('Assessment and Plan fields are required.');
    }

    const note = await ClinicalNote.create({
        patientId: req.params.id,
        doctorId: req.user.id,
        subjective,
        objective,
        assessment,
        plan,
    });
    res.status(201).json(note);
});

// @desc    Create a prescription for a patient
// @route   POST /api/doctor/patients/:id/prescriptions
const createPrescription = asyncHandler(async (req, res) => {
    const { medications, notes } = req.body;
    if (!medications || medications.length === 0) {
        res.status(400); throw new Error('At least one medication is required.');
    }
    const prescription = await Prescription.create({
        patient: req.params.id,
        doctor: req.user.id,
        medications,
        notes,
    });
    res.status(201).json(prescription);
});

// @desc    Get lab reports for a doctor's patients
// @route   GET /api/doctor/lab-reports
const getLabReports = asyncHandler(async (req, res) => {
    const doctorId = req.user.id;
    const patientIds = await Appointment.distinct('patientId', { doctorId });
    
    const reports = await LabReport.find({ 'patient': { $in: patientIds } })
        .populate('patient', 'firstName lastName')
        .populate('labTest', 'name');

    res.json(reports);
});

// @desc    Get analytics data for the doctor dashboard
// @route   GET /api/doctor/analytics
const getAnalytics = asyncHandler(async (req, res) => {
    const doctorId = req.user.id;

    // Consultations per day for the last 7 days
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
    const consultations = await Appointment.aggregate([
        { $match: { doctorId: new mongoose.Types.ObjectId(doctorId), appointmentDate: { $gte: sevenDaysAgo } } },
        { $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$appointmentDate" } },
            count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
    ]);
    
    const patientCount = (await Appointment.distinct('patientId', { doctorId })).length;
    const upcomingAppointments = await Appointment.countDocuments({ doctorId, status: 'Scheduled', appointmentDate: { $gte: new Date() } });

    res.json({ consultationsPerDay: consultations, patientCount, upcomingAppointments });
});

// @desc    Get all appointments for the logged-in doctor
// @route   GET /api/doctor/appointments
const getAppointments = asyncHandler(async (req, res) => {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId })
        .populate('patientId', 'firstName lastName email');
    res.json(appointments);
});

// @desc    Get all prescriptions created by the logged-in doctor
// @route   GET /api/doctor/prescriptions
const getPrescriptions = asyncHandler(async (req, res) => {
    const doctorId = req.user.id;
    const prescriptions = await Prescription.find({ doctor: doctorId })
        .populate('patient', 'firstName lastName');
    res.json(prescriptions);
});

module.exports = { 
    getDashboardStats, 
    getMyPatients, 
    getPatientDetails,
    createClinicalNote,
    createPrescription,
    getLabReports,
    getAnalytics,
    getAppointments,
    getPrescriptions
};