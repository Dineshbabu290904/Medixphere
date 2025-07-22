const express = require("express");
const router = express.Router();
const { getMessages, getConversations } = require("../../controllers/Other/message.controller.js");
const { authMiddleware } = require('../../middlewares/auth.middleware');

router.use(authMiddleware);

router.get('/conversations', getConversations);
router.get('/:recipientId', getMessages);

module.exports = router;