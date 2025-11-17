import Notification from "../../models/notificationModel.js"


export const sendFinanceNotification = async (req, res) => {
  const { to, message, researchId, recipientRole, title, type, file } = req.body;

  if (!to || !message || !researchId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const notification = new Notification({
      to,
      message,
      researchId,
      title,
      type,
      file,
      recipientRole,
    });

    await notification.save();

    res.status(201).json({ message: "Notification sent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export const getFinanceNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientRole: "finance",
    }).sort({ timestamp: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};