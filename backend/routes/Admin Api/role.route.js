const express = require('express');
const router = express.Router();
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
} = require('../../controllers/Admin/role.controller');
// const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware');

router.post('/create', createRole);
router.get('/getAll', getAllRoles);
router.get('/get/:id', getRoleById);
router.put('/update/:id', updateRole);
router.delete('/delete/:id', deleteRole);

module.exports = router;