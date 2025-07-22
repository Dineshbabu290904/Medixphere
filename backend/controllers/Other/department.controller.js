const Department = require("../../models/Other/department.model");

const getDepartment = async (req, res) => {
    try {
        const departments = await Department.find();

        return res.status(200).json({
            success: true,
            message: "All Departments Loaded!",
            departments,
        });
    } catch (error) {
        console.error("Error in getDepartment:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

const addDepartment = async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Department name is required",
            });
        }

        const existingDepartment = await Department.findOne({ name });
        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: "Department already exists",
            });
        }

        const newDepartment = await Department.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Department added successfully",
            department: newDepartment,
        });
    } catch (error) {
        console.error("Error in addDepartment:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required",
            });
        }

        const deletedDepartment = await Department.findByIdAndDelete(id);
        
        if (!deletedDepartment) {
            return res.status(404).json({ 
                success: false, 
                message: "Department not found" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Department deleted successfully",
            department: deletedDepartment,
        });
    } catch (error) {
        console.error("Error in deleteDepartment:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error" 
        });
    }
};

module.exports = { getDepartment, addDepartment, deleteDepartment };