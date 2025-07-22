const express = require('express');
const router = express.Router();
const { getRecentActivities } = require('../../controllers/Other/activitylog.controller.js');
const { authMiddleware, checkRole } = require('../../middlewares/auth.middleware.js');

// THE FIX: Added 'doctor' to the array of allowed roles.
router.get('/recent', authMiddleware, checkRole(['admin', 'doctor']), getRecentActivities);

module.exports = router;