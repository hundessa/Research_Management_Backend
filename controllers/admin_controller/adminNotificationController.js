import Notification from "../../models/notificationModel.js";

export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "admin",
    }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



export const sendAdminNotification = (req, res) => {
  const { to, message, researchId, researcher, title, type, file } = req.body;

  // Here, you can either save this to a DB or just log it for now
  console.log("New Notification to Dean:", {
    to,
    message,
    researchId,
    researcher,
    title,
    type,
    file,
  });

  // Temporary response
  res.status(201).json({ message: "Notification sent successfully" });
};
