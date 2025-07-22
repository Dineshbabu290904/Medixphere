const doctorDetails = require("../../models/Doctor/details.model.js");
const { generateDoctorId } = require("../../utils/idGenerator");

const getDetails = async (req, res) => {
    try {
        let user = await doctorDetails.find(req.body);
        if (!user || user.length === 0) {
            return res
                .status(200) // Changed to 200 to indicate no content rather than error
                .json({ success: true, message: "No Doctor Found", user: [] });
        }
        const data = {
            success: true,
            message: "Doctor Details Found!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addDetails = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required",
            });
        }

        // Generate the new doctor ID automatically on the backend.
        const newDoctorId = await generateDoctorId();

        // Check if a doctor with the same email already exists to prevent duplicates.
        const existingDoctor = await doctorDetails.findOne({ email: req.body.email });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: `A doctor with the email ${req.body.email} already exists.`,
            });
        }

        // Create the new doctor record with the auto-generated employeeId.
        const user = await doctorDetails.create({ 
            ...req.body, 
            employeeId: newDoctorId, 
            profile: req.file.filename 
        });

        const data = {
            success: true,
            message: "Doctor Details Added!",
            user, // The user object now contains the new employeeId
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await doctorDetails.findByIdAndUpdate(
                req.params.id, 
                { ...req.body, profile: req.file.filename },
                { new: true }
            );
        } else {
            user = await doctorDetails.findByIdAndUpdate(
                req.params.id, 
                req.body,
                { new: true }
            );
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Doctor Found",
            });
        }

        const data = {
            success: true,
            message: "Updated Successful!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDetails = async (req, res) => {
    try {
        let user = await doctorDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Doctor Found",
            });
        }
        const data = {
            success: true,
            message: "Deleted Successful!",
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getDetailsByDepartment = async (req, res) => {
    try {
        const { departmentName } = req.params;
        const doctors = await doctorDetails.find({ department: departmentName });

        if (!doctors || doctors.length === 0) {
            return res.status(200).json({ success: true, message: "No doctors found for this department.", doctors: [] });
        }

        res.json({ success: true, message: "Doctors found!", doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getCount = async (req, res) => {
    try {
        const { department } = req.query;

        // --- START: CRITICAL FIX ---
        // Create a filter object.
        const filter = {};

        // If a 'department' query parameter exists, add it to our filter.
        if (department) {
            filter.department = department;
        }
        // --- END: CRITICAL FIX ---

        // Pass the constructed filter object to countDocuments.
        // If no department was specified, the filter will be an empty object {},
        // which correctly counts all documents.
        let count = await doctorDetails.countDocuments(filter); 

        const data = {
            success: true,
            message: "Count Successful!",
            count,
        };
        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
}

module.exports = { getDetails, addDetails, updateDetails, deleteDetails, getCount, getDetailsByDepartment };