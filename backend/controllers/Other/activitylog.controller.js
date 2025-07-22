const ActivityLog = require('../../models/Other/activitylog.model');

exports.getRecentActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const activities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('user', 'firstName lastName'); // Populate user's name

    res.json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};