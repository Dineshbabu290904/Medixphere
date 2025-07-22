const adminDetails = require("../../models/Admin/details.model.js");
const { generateAdminId } = require("../../utils/idGenerator"); // Import the ID generator
const { logActivity } = require('../../utils/activityLogger'); // Optional: for logging

const getDetails = async (req, res) => {
    try {
        let user = await adminDetails.find(req.body);
        if (!user || user.length === 0) {
            return res
                .status(200)
                .json({ success: true, message: "No Admin Found", user: [] });
        }
        const data = {
            success: true,
            message: "Admin Details Found!",
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
        
        const newAdminId = await generateAdminId();

        const existingAdmin = await adminDetails.findOne({ $or: [{ employeeId: newAdminId }, { email: req.body.email }] });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this Employee ID or Email already exists.",
            });
        }
        
        const user = await adminDetails.create({ 
            ...req.body, 
            employeeId: newAdminId, 
            profile: req.file.filename 
        });

        await logActivity('ADMIN_CREATED', `New admin ${user.firstName} ${user.lastName} (${user.employeeId}) was registered.`);

        const data = {
            success: true,
            message: "Admin Details Added!",
            user,
        };
        res.status(201).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await adminDetails.findByIdAndUpdate(
                req.params.id, 
                { ...req.body, profile: req.file.filename },
                { new: true }
            );
        } else {
            user = await adminDetails.findByIdAndUpdate(
                req.params.id, 
                req.body,
                { new: true }
            );
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No Admin Found",
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
        // In a real system, you might want to deactivate instead of delete.
        // Also, you would need to delete associated credentials.
        let user = await adminDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No Admin Found",
            });
        }
        // TODO: Delete from Admin Credential model as well.
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

module.exports = { getDetails, addDetails, updateDetails, deleteDetails };