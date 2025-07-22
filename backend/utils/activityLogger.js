const ActivityLog = require('../models/Other/activitylog.model');

/**
 * A helper function to log an activity.
 * @param {string} action - A short code for the action, e.g., 'PATIENT_CREATED'.
 * @param {string} description - A human-readable description of the event.
 * @param {object} [userDetails] - Optional details about the user performing the action.
 * @param {string} [userDetails.userId] - The ObjectId of the user.
 * @param {string} [userDetails.userModel] - The Mongoose model name of the user ('Admin Detail' or 'Doctor Detail').
 */
const logActivity = async (action, description, userDetails) => {
  try {
    const logEntry = { action, description };
    if (userDetails) {
      logEntry.user = userDetails.userId;
      logEntry.userModel = userDetails.userModel;
    }
    await ActivityLog.create(logEntry);
  } catch (error) {
    // Log the error but don't crash the main operation
    console.error('Failed to log activity:', error);
  }
};

module.exports = { logActivity };