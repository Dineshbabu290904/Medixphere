const asyncHandler = require('express-async-handler');
const Message = require('../../models/Other/Message.model');
const Admin = require('../../models/Admin/details.model');
const Doctor = require('../../models/Doctor/details.model');

// Helper to fetch user details from multiple collections
const getUserDetails = async (userId) => {
    if (!userId) return null;
    let user = await Admin.findById(userId, 'firstName lastName').lean();
    if (!user) {
        user = await Doctor.findById(userId, 'firstName lastName').lean();
    }
    // Can be extended to other staff models
    return user;
};

// @desc    Get messages between two users
// @route   GET /api/messages/:recipientId
const getMessages = asyncHandler(async (req, res) => {
  const { recipientId } = req.params;
  const senderId = new mongoose.Types.ObjectId(req.user.id);

  const rawMessages = await Message.find({
    $or: [
      { sender: senderId, receiver: recipientId },
      { sender: recipientId, receiver: senderId },
    ],
  }).sort({ createdAt: 'asc' }).lean();

  // Manually populate sender details
  const messages = await Promise.all(rawMessages.map(async (msg) => {
    const senderDetails = await getUserDetails(msg.sender);
    return { ...msg, sender: senderDetails || { firstName: 'Unknown', lastName: 'User' } };
  }));

  res.json(messages);
});

// @desc    Get a list of conversations for the current user
// @route   GET /api/messages/conversations
const getConversations = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Get latest message for each conversation partner
    const lastMessages = await Message.aggregate([
        { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: {
                        if: { $eq: ["$sender", userId] },
                        then: "$receiver",
                        else: "$sender"
                    }
                },
                lastMessage: { $first: "$$ROOT" }
            }
        },
        { $replaceRoot: { newRoot: "$lastMessage" } }
    ]);
    
    // Manually populate details for each conversation partner
    const conversations = await Promise.all(lastMessages.map(async (msg) => {
        const otherUserId = msg.sender.equals(userId) ? msg.receiver : msg.sender;
        const [senderInfo, receiverInfo] = await Promise.all([
            getUserDetails(msg.sender),
            getUserDetails(msg.receiver)
        ]);
        return {
            ...msg,
            senderInfo: senderInfo || { firstName: 'Unknown' },
            receiverInfo: receiverInfo || { firstName: 'Unknown' },
        };
    }));

    res.json(conversations);
});

module.exports = { getMessages, getConversations };