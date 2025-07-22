const express = require("express");
const router = express.Router();
const { getUsers } = require("../../controllers/Other/user.controller.js");
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/', getUsers);

module.exports = router;