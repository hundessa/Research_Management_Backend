import Notification from "../models/notificationModel.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user.id,
    recipientRole: req.user.role,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: notifications,
  });
});