const Role = require('../../models/Admin/role.model');

// @desc    Create a new role
// @route   POST /api/admin/roles/create
// @access  Admin
const createRole = async (req, res) => {
    const { name, permissions, description } = req.body;

    if (!name || !permissions) {
        return res.status(400).json({ success: false, message: 'Role name and permissions are required.' });
    }

    try {
        const roleExists = await Role.findOne({ name: name.toUpperCase() });
        if (roleExists) {
            return res.status(400).json({ success: false, message: 'Role with this name already exists.' });
        }

        const role = new Role({
            name: name.toUpperCase(),
            permissions,
            description,
        });

        const createdRole = await role.save();
        res.status(201).json({ success: true, message: "Role created successfully", role: createdRole });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all roles
// @route   GET /api/admin/roles/getAll
// @access  Admin
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({});
        res.json({ success: true, roles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get a single role by ID
// @route   GET /api/admin/roles/get/:id
// @access  Admin
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            res.json({ success: true, role });
        } else {
            res.status(404).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Update a role
// @route   PUT /api/admin/roles/update/:id
// @access  Admin
const updateRole = async (req, res) => {
    const { permissions, description } = req.body;
    try {
        const role = await Role.findById(req.params.id);

        if (role) {
            role.permissions = permissions ?? role.permissions;
            role.description = description ?? role.description;
            
            const updatedRole = await role.save();
            res.json({ success: true, message: "Role updated successfully", role: updatedRole });
        } else {
            res.status(404).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a role
// @route   DELETE /api/admin/roles/delete/:id
// @access  Admin
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            // Prevent deletion of core roles if needed
            if (['ADMIN', 'DOCTOR', 'PATIENT'].includes(role.name)) {
                return res.status(400).json({ success: false, message: 'Cannot delete core system roles.' });
            }
            await role.deleteOne();
            res.json({ success: true, message: 'Role removed successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Role not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


module.exports = {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
};