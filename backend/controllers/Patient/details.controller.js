const patientDetails = require("../../models/Patient/details.model.js");
const { generatePatientId } = require("../../utils/idGenerator");
const { logActivity } = require('../../utils/activityLogger');
const Appointment = require('../../models/Other/appointment.model');
const doctorDetailsModel = require('../../models/Doctor/details.model.js');

// GET a patient's details. Can find by patientId, _id, or phoneNumber.
const getDetails = async (req, res) => {
    try {
        // The filter can be { patientId: '...' }, { _id: '...' }, or { phoneNumber: '...' }
        const users = await patientDetails.find(req.body).populate({
            path: 'family.patientId',
            select: 'firstName lastName patientId' // Select fields to return
        });

        if (!users || users.length === 0) {
            return res.status(200).json({ success: true, user: [] }); // Return empty array if not found
        }

        res.json({ success: true, message: "Patient Details Found!", user: users });

    } catch (error)
    {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// ADD a new patient, handling family logic.
const addDetails = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Profile image is required" });
        }

        const { phoneNumber, firstName, lastName, email, dateOfBirth, bloodGroup, address, gender, relationship, middleName } = req.body;

        // Generate a new unique ID for this specific patient.
        const newPatientId = await generatePatientId();

        const newPatientData = {
            firstName,
            middleName,
            lastName,
            email,
            phoneNumber,
            dateOfBirth: new Date(dateOfBirth), // Ensure it's a Date object
            bloodGroup,
            address,
            gender,
            patientId: newPatientId,
            profile: req.file.filename,
        };

        // Find the primary contact for this phone number, if one exists.
        // We need to look for a patient who is marked as 'isPrimaryContact: true' for that phone number
        const primaryFamilyMember = await patientDetails.findOne({ phoneNumber: phoneNumber, 'family.isPrimaryContact': true });

        let user;
        if (primaryFamilyMember) {
            // SCENARIO 1: Family exists. Add new patient and link them.
            user = await patientDetails.create(newPatientData);

            // Add the new patient to the primary member's family list.
            primaryFamilyMember.family.push({
                patientId: user._id,
                relationship: relationship || 'Unspecified', // Use provided relationship or default
                isPrimaryContact: false
            });
            await primaryFamilyMember.save();

        } else {
            // SCENARIO 2: New family. Create the patient and mark them as the primary contact.
            user = new patientDetails(newPatientData);

            // Add themselves to their own family list as the primary contact.
            user.family.push({
                patientId: user._id, // Reference to themselves
                relationship: 'Self',
                isPrimaryContact: true
            });
            await user.save();
        }

        await logActivity('PATIENT_CREATED', `New patient ${user.firstName} ${user.lastName} (${user.patientId}) was registered.`);

        res.status(201).json({ 
            success: true, 
            message: "Patient registered successfully!", 
            user 
        });

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: "A patient with this unique ID or email already exists. Please try again." });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// ... other CRUD functions like updateDetails, deleteDetails, getCount ...
const updateDetails = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            updateData.profile = req.file.filename;
        }

        const user = await patientDetails.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: "No Patient Found" });
        }

        res.json({ success: true, message: "Updated Successful!", user });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDetails = async (req, res) => {
    try {
        const user = await patientDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "No Patient Found" });
        }
        // Also need to remove them from any family lists and delete their credentials, etc.
        // For now, this is a simple deletion.
        res.json({ success: true, message: "Deleted Successful!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getCount = async (req, res) => {
    try {
        const filter = { ...req.query };
        const count = await patientDetails.countDocuments(filter);
        res.json({ success: true, message: "Count Successful!", count });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getDetailsByDepartment = async (req, res) => {
    try {
        const { departmentName } = req.params;

        const doctorsInDept = await doctorDetailsModel.find({ department: departmentName }).select('_id');
        const doctorIds = doctorsInDept.map(d => d._id);

        if (doctorIds.length === 0) {
            return res.json({ success: true, message: "No doctors in department.", patients: [] });
        }

        // Find patient IDs from appointments where the doctor is in the specified department
        const patientIds = await Appointment.find({ doctorId: { $in: doctorIds } }).distinct('patientId');

        // Fetch details of these patients
        const patients = await patientDetails.find({ _id: { $in: patientIds } });

        res.json({ success: true, message: "Patients found!", patients });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getAllDetails = async (req, res) => {
    try {
        const users = await patientDetails.find({});
        res.json({ success: true, message: "All Patient Details Found!", users: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
module.exports = { 
    getDetails, 
    addDetails, 
    updateDetails, 
    deleteDetails, 
    getCount, 
    getDetailsByDepartment, 
    getAllDetails
};