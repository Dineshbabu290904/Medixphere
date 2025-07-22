const express = require("express");
const { getNotice, addNotice, updateNotice, deleteNotice } = require("../../controllers/Other/notice.controller");
const router = express.Router();
const { authMiddleware, checkRole } = require("../../middlewares/auth.middleware.js");

// Protect all notice routes
router.use(authMiddleware);

// Anyone logged in can get notices
router.post("/getNotice", getNotice); 

// Only admin can add, update, or delete notices
router.post("/addNotice", checkRole(['admin']), addNotice);
router.put("/updateNotice/:id", checkRole(['admin']), updateNotice);
router.delete("/deleteNotice/:id", checkRole(['admin']), deleteNotice);

module.exports = router;